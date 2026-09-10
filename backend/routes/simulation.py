from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Location, DrainageZone, RainfallRecord
from schemas import SimulationInput, SimulationResult, AffectedZoneSummary
from services.flood_calculator import compute_zone_risk, aggregate_city_risk
from services.alert_engine import generate_alerts_from_zones

router = APIRouter(prefix="/api/simulation", tags=["Flood Simulation"])

@router.post("/run", response_model=SimulationResult)
def run_simulation(sim_input: SimulationInput, db: Session = Depends(get_db)):
    city = sim_input.target_city or "Hyderabad"
    locs = db.query(Location).filter(Location.city == city).all()

    affected_zones = []
    zone_evals = []

    for l in locs:
        base_data = {
            "id": l.id,
            "name": l.name,
            "city": l.city,
            "latitude": l.latitude,
            "longitude": l.longitude,
            "elevation": l.elevation,
            "slope": l.slope,
            "impervious": l.impervious_surface,
            "historical_flood_freq": 8.5 if sim_input.historical_flood_risk == "High" else (5.0 if sim_input.historical_flood_risk == "Medium" else 2.5),
            "capacity": sim_input.drainage_capacity,
            "base_load": sim_input.rainfall_intensity * (l.impervious_surface / 100.0),
            "base_rainfall": sim_input.rainfall_intensity,
            "forecast": sim_input.forecast_rainfall,
            "drain_id": f"DR-SIM-{l.id:02d}",
            "blockage_pct": sim_input.drainage_blockage,
            "water_accumulation": "Severe" if sim_input.rainfall_intensity > 80 else "High"
        }

        eval_res = compute_zone_risk(
            base_data,
            rainfall_override=sim_input.rainfall_intensity,
            forecast_override=sim_input.forecast_rainfall,
            capacity_override=sim_input.drainage_capacity,
            blockage_override=sim_input.drainage_blockage
        )
        zone_evals.append(eval_res)

        affected_zones.append(AffectedZoneSummary(
            location_id=l.id,
            name=l.name,
            latitude=l.latitude,
            longitude=l.longitude,
            rainfall=eval_res["rainfall_rate"],
            drainage_load_pct=eval_res["drainage_utilization"],
            flood_probability=eval_res["flood_probability"],
            risk_level=eval_res["risk_level"],
            predicted_time=eval_res["predicted_time"],
            elevation=eval_res["elevation"],
            recommendation=eval_res["recommended_action"]
        ))

    agg = aggregate_city_risk(zone_evals)

    # General recommendation based on overall city risk
    if agg["overall_city_risk"] == "CRITICAL":
        gen_rec = "CRITICAL ADVISORY: Immediately alert municipal emergency response teams, deploy mobile pump units, and restrict traffic through low-lying arterial corridors."
    elif agg["overall_city_risk"] == "HIGH":
        gen_rec = "HIGH ALERT: Pre-position disaster relief teams at vulnerable flood basins and issue localized waterlogging cautions to motorists."
    else:
        gen_rec = "MONITORING ADVISORY: Drainage infrastructure coping adequately with current precipitation rates. Maintain routine supervisory patrols."

    # Sort affected zones by risk severity
    affected_zones.sort(key=lambda x: x.flood_probability, reverse=True)

    return SimulationResult(
        simulated_rainfall=sim_input.rainfall_intensity,
        simulated_drainage_capacity=sim_input.drainage_capacity,
        simulated_blockage=sim_input.drainage_blockage,
        overall_city_risk=agg["overall_city_risk"],
        critical_zones_count=agg["critical_zones_count"],
        high_risk_zones_count=agg["high_risk_zones_count"],
        moderate_zones_count=agg["moderate_zones_count"],
        safe_zones_count=agg["safe_zones_count"],
        affected_zones=affected_zones,
        general_recommendation=gen_rec
    )
