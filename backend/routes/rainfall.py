from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import get_db
from models import Location, RainfallRecord

router = APIRouter(prefix="/api/rainfall", tags=["Rainfall Monitoring"])

@router.get("")
def get_rainfall_monitoring(city: str = Query("Hyderabad"), db: Session = Depends(get_db)):
    records = (
        db.query(RainfallRecord, Location)
        .join(Location, RainfallRecord.location_id == Location.id)
        .filter(Location.city == city)
        .all()
    )

    stations = []
    max_current = 0.0
    for rf, loc in records:
        if rf.current_rainfall > max_current:
            max_current = rf.current_rainfall
        stations.append({
            "station_id": f"STN-{loc.id:03d}",
            "location_id": loc.id,
            "location_name": loc.name,
            "latitude": loc.latitude,
            "longitude": loc.longitude,
            "current_rainfall": rf.current_rainfall,
            "rainfall_last_1h": rf.rainfall_last_1h,
            "rainfall_last_3h": rf.rainfall_last_3h,
            "rainfall_last_6h": rf.rainfall_last_6h,
            "forecast_rainfall": rf.forecast_rainfall,
            "intensity_status": rf.intensity_status,
            "trend": rf.trend,
            "elevation": loc.elevation
        })

    # Time-series rainfall progression
    time_chart = [
        {"time": "12:00", "rainfall": 12.0, "status": "Moderate"},
        {"time": "12:30", "rainfall": 20.0, "status": "Moderate"},
        {"time": "13:00", "rainfall": 35.0, "status": "Heavy"},
        {"time": "13:30", "rainfall": 48.0, "status": "Heavy"},
        {"time": "14:00 (Live)", "rainfall": max_current, "status": "Torrential" if max_current > 50 else "Heavy"},
        {"time": "14:30 (Forecast)", "rainfall": round(max_current * 1.15, 1), "status": "Torrential"},
        {"time": "15:00 (Forecast)", "rainfall": round(max_current * 1.28, 1), "status": "Torrential"},
    ]

    return {
        "city": city,
        "summary": {
            "current_rainfall": f"{max_current} mm/hr",
            "max_station": max(stations, key=lambda x: x["current_rainfall"])["location_name"] if stations else "None",
            "trend_signal": "Rainfall intensity increasing rapidly" if max_current >= 40.0 else "Stable Monsoonal Inflow",
            "is_critical": max_current >= 50.0
        },
        "time_chart": time_chart,
        "stations": stations
    }
