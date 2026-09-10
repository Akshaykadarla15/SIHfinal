from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import get_db
from models import Location, Alert
from routes.risk_zones import build_zone_dicts
from services.flood_calculator import aggregate_city_risk

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("")
def get_dashboard_summary(city: str = Query("Hyderabad"), db: Session = Depends(get_db)):
    zones = build_zone_dicts(db, city)
    agg = aggregate_city_risk(zones)

    # Top active alerts for city
    alerts = (
        db.query(Alert)
        .join(Location, Alert.location_id == Location.id)
        .filter(Location.city == city, Alert.status == "active")
        .order_by(Alert.flood_probability.desc())
        .limit(5)
        .all()
    )

    alert_list = [
        {
            "id": a.id,
            "title": a.title,
            "severity": a.severity,
            "location_name": a.location.name,
            "flood_probability": a.flood_probability,
            "expected_time": a.expected_time,
            "reason": a.reason,
            "recommended_action": a.recommended_action,
            "status": a.status,
            "created_at": a.created_at.strftime("%H:%M")
        }
        for a in alerts
    ]

    # Hourly rainfall trend for the city (synthesized dynamic curve)
    base_rain = agg["max_rainfall_current"]
    trend_data = [
        {"time": "11:00", "rainfall": round(max(5.0, base_rain * 0.25), 1), "forecast": round(base_rain * 0.35, 1)},
        {"time": "11:30", "rainfall": round(max(10.0, base_rain * 0.45), 1), "forecast": round(base_rain * 0.55, 1)},
        {"time": "12:00", "rainfall": round(max(15.0, base_rain * 0.65), 1), "forecast": round(base_rain * 0.75, 1)},
        {"time": "12:30", "rainfall": round(max(20.0, base_rain * 0.85), 1), "forecast": round(base_rain * 0.95, 1)},
        {"time": "13:00 (Now)", "rainfall": base_rain, "forecast": agg["max_rainfall_forecast"]},
        {"time": "13:30 (Pred)", "rainfall": round(agg["max_rainfall_forecast"] * 0.95, 1), "forecast": round(agg["max_rainfall_forecast"] * 1.1, 1)},
        {"time": "14:00 (Pred)", "rainfall": round(agg["max_rainfall_forecast"] * 1.15, 1), "forecast": round(agg["max_rainfall_forecast"] * 1.25, 1)}
    ]

    return {
        "city": city,
        "metrics": {
            "current_rainfall": f"{agg['max_rainfall_current']} mm/hr",
            "current_rainfall_val": agg['max_rainfall_current'],
            "max_rainfall_forecast": f"{agg['max_rainfall_forecast']} mm/hr",
            "max_rainfall_forecast_val": agg['max_rainfall_forecast'],
            "high_risk_zones": f"{agg['high_risk_zones_count']} Areas",
            "high_risk_zones_count": agg['high_risk_zones_count'],
            "critical_zones": f"{agg['critical_zones_count']} Areas",
            "critical_zones_count": agg['critical_zones_count'],
            "drainage_capacity": f"{agg['drainage_available_pct']}% Available",
            "drainage_available_pct": agg['drainage_available_pct'],
            "overall_city_risk": agg['overall_city_risk']
        },
        "rainfall_trend": trend_data,
        "warning_banner": "Rainfall intensity increasing rapidly. 2 low-lying basins approaching spill threshold." if agg['max_rainfall_current'] > 45 else None,
        "active_alerts": alert_list,
        "zones": zones
    }
