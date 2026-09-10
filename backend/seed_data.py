import os
import sys
import json
import datetime
from sqlalchemy.orm import Session
from database import engine, Base, SessionLocal
from models import User, Location, RainfallRecord, DrainageZone, RiskPrediction, Alert, HistoricalFlood
from services.data_provider import DemoDataProvider
from services.flood_calculator import compute_zone_risk
from services.alert_engine import generate_alerts_from_zones

def seed_database():
    print("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # 1. Seed Demo Users if not present
        if db.query(User).count() == 0:
            users = [
                User(email="admin@flood.ai", password="admin123", role="admin", name="Shri R. K. Sharma", badge="Municipal Commissioner / Disaster Lead"),
                User(email="officer@flood.ai", password="officer123", role="officer", name="Insp. Vikram Rao", badge="Zonal Field Operations Chief"),
                User(email="user@flood.ai", password="user123", role="public", name="Ananya Reddy", badge="Citizen Public User")
            ]
            db.add_all(users)
            db.commit()
            print("Demo users seeded successfully.")

        # 2. Seed Locations & Infrastructure
        if db.query(Location).count() == 0:
            provider = DemoDataProvider()
            for city_name, loc_list in provider.CITIES_DATA.items():
                for item in loc_list:
                    loc = Location(
                        city=city_name,
                        name=item["name"],
                        latitude=item["lat"],
                        longitude=item["lng"],
                        elevation=item["elevation"],
                        slope=item["slope"],
                        impervious_surface=item["impervious"],
                        historical_flood_frequency=item["historical_flood_freq"],
                        base_drainage_capacity=item["capacity"],
                        water_accumulation_level=item["water_accumulation"]
                    )
                    db.add(loc)
                    db.flush()

                    # Drainage Zone
                    dz = DrainageZone(
                        drain_id=item["drain_id"],
                        location_id=loc.id,
                        max_capacity=item["capacity"],
                        current_load=item["base_load"],
                        utilization_percentage=round((item["base_load"] / item["capacity"]) * 100.0, 1),
                        blockage_status="Suspected" if item["water_accumulation"] in ["Severe", "High"] else "Clear",
                        blockage_percentage=25.0 if item["water_accumulation"] == "Severe" else 5.0,
                        overflow_risk="High" if item["water_accumulation"] == "Severe" else "Moderate",
                        status="Critical" if item["water_accumulation"] == "Severe" else ("Warning" if item["water_accumulation"] == "High" else "Normal"),
                        last_inspection="Today, 09:15 AM",
                        reported_by="Municipal Ward Team"
                    )
                    db.add(dz)

                    # Rainfall Record
                    rf = RainfallRecord(
                        location_id=loc.id,
                        current_rainfall=item["base_rainfall"],
                        rainfall_last_1h=round(item["base_rainfall"] * 0.8, 1),
                        rainfall_last_3h=round(item["base_rainfall"] * 2.1, 1),
                        rainfall_last_6h=round(item["base_rainfall"] * 3.4, 1),
                        forecast_rainfall=item["forecast"],
                        intensity_status="Torrential" if item["base_rainfall"] > 50 else ("Heavy" if item["base_rainfall"] > 35 else "Moderate"),
                        trend="Rapidly Increasing" if item["base_rainfall"] > 40 else "Increasing"
                    )
                    db.add(rf)

                    # Historical Flood Events for key locations
                    hist_events = [
                        HistoricalFlood(
                            location_id=loc.id,
                            event_date="2020-10-14",
                            rainfall_mm=192.5,
                            peak_water_level=1.85,
                            flood_duration_hours=14.0,
                            severity="Severe",
                            drainage_performance="Surcharged & Backflowing",
                            damage_reported="Waterlogging in cellars, traffic paralysis for 8 hours"
                        ),
                        HistoricalFlood(
                            location_id=loc.id,
                            event_date="2022-07-23",
                            rainfall_mm=114.0,
                            peak_water_level=0.95,
                            flood_duration_hours=6.5,
                            severity="High",
                            drainage_performance="Overflow at storm culverts",
                            damage_reported="Inundation of low-lying commercial shops"
                        ),
                        HistoricalFlood(
                            location_id=loc.id,
                            event_date="2023-08-19",
                            rainfall_mm=88.0,
                            peak_water_level=0.55,
                            flood_duration_hours=3.5,
                            severity="Moderate",
                            drainage_performance="Slow discharge due to trash debris",
                            damage_reported="Local traffic slow down, cleared within 3 hours"
                        )
                    ]
                    db.add_all(hist_events)

            db.commit()
            print("Locations, drainage zones, rainfall, and historical events seeded.")

            # Compute initial predictions & alerts for Hyderabad
            hyd_locs = db.query(Location).filter(Location.city == "Hyderabad").all()
            hyd_dicts = []
            for l in hyd_locs:
                dz = db.query(DrainageZone).filter(DrainageZone.location_id == l.id).first()
                rf = db.query(RainfallRecord).filter(RainfallRecord.location_id == l.id).first()
                hyd_dicts.append({
                    "id": l.id,
                    "name": l.name,
                    "city": l.city,
                    "lat": l.latitude,
                    "lng": l.longitude,
                    "elevation": l.elevation,
                    "slope": l.slope,
                    "impervious": l.impervious_surface,
                    "historical_flood_freq": l.historical_flood_frequency,
                    "capacity": dz.max_capacity if dz else 75.0,
                    "base_load": dz.current_load if dz else 40.0,
                    "base_rainfall": rf.current_rainfall if rf else 35.0,
                    "forecast": rf.forecast_rainfall if rf else 45.0,
                    "drain_id": dz.drain_id if dz else "DR-101",
                    "blockage_pct": dz.blockage_percentage if dz else 0.0,
                    "water_accumulation": l.water_accumulation_level
                })

            evaluated_zones = [compute_zone_risk(d) for d in hyd_dicts]
            alerts = generate_alerts_from_zones(evaluated_zones)

            for a in alerts:
                db_alert = Alert(
                    location_id=a["location_id"],
                    title=a["title"],
                    severity=a["severity"],
                    flood_probability=a["flood_probability"],
                    expected_time=a["expected_time"],
                    reason=a["reason"],
                    recommended_action=a["recommended_action"],
                    status="active"
                )
                db.add(db_alert)

            for ez in evaluated_zones:
                db_pred = RiskPrediction(
                    location_id=ez["location_id"],
                    flood_probability=ez["flood_probability"],
                    risk_level=ez["risk_level"],
                    predicted_time=ez["predicted_time"],
                    recommended_action=ez["recommended_action"],
                    xai_heavy_rainfall=ez["xai_factors"]["heavy_rainfall"],
                    xai_drainage_overload=ez["xai_factors"]["drainage_overload"],
                    xai_low_elevation=ez["xai_factors"]["low_elevation"],
                    xai_historical_risk=ez["xai_factors"]["historical_risk"],
                    nowcast_timeline=json.dumps(ez["nowcast_timeline"])
                )
                db.add(db_pred)

            db.commit()
            print("Predictions and initial active alerts generated.")

    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
