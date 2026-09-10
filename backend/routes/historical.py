from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import get_db
from models import HistoricalFlood, Location

router = APIRouter(prefix="/api/historical-data", tags=["Historical Flood Data"])

@router.get("")
def get_historical_data(
    city: str = Query("Hyderabad"),
    severity: str = Query(None),
    location: str = Query(None),
    min_rainfall: float = Query(None),
    db: Session = Depends(get_db)
):
    query = (
        db.query(HistoricalFlood, Location)
        .join(Location, HistoricalFlood.location_id == Location.id)
        .filter(Location.city == city)
    )

    if severity:
        query = query.filter(HistoricalFlood.severity == severity)
    if location:
        query = query.filter(Location.name.ilike(f"%{location}%"))
    if min_rainfall is not None:
        query = query.filter(HistoricalFlood.rainfall_mm >= min_rainfall)

    records = query.order_by(HistoricalFlood.rainfall_mm.desc()).all()

    events = []
    for hf, loc in records:
        events.append({
            "id": hf.id,
            "location_name": loc.name,
            "city": loc.city,
            "event_date": hf.event_date,
            "rainfall_mm": hf.rainfall_mm,
            "peak_water_level": hf.peak_water_level,
            "flood_duration_hours": hf.flood_duration_hours,
            "severity": hf.severity,
            "drainage_performance": hf.drainage_performance,
            "damage_reported": hf.damage_reported or "No major structural damage recorded."
        })

    # Summary charts data: Rainfall vs Inundation Height
    chart_series = [
        {
            "event": f"{e['location_name']} ({e['event_date'][:7]})",
            "rainfall": e["rainfall_mm"],
            "water_level": e["peak_water_level"],
            "duration": e["flood_duration_hours"]
        }
        for e in events[:10]
    ]

    return {
        "city": city,
        "total_records": len(events),
        "chart_data": chart_series,
        "events": events
    }
