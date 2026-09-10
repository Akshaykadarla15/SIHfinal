from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import Location, DrainageZone, RainfallRecord
from services.flood_calculator import compute_zone_risk

router = APIRouter(prefix="/api/risk-zones", tags=["Risk Zones"])

def build_zone_dicts(db: Session, city: str):
    locs = db.query(Location).filter(Location.city == city).all()
    results = []
    for l in locs:
        dz = db.query(DrainageZone).filter(DrainageZone.location_id == l.id).first()
        rf = db.query(RainfallRecord).filter(RainfallRecord.location_id == l.id).first()

        data_dict = {
            "id": l.id,
            "name": l.name,
            "city": l.city,
            "latitude": l.latitude,
            "longitude": l.longitude,
            "elevation": l.elevation,
            "slope": l.slope,
            "impervious": l.impervious_surface,
            "historical_flood_freq": l.historical_flood_frequency,
            "capacity": dz.max_capacity if dz else 70.0,
            "base_load": dz.current_load if dz else 40.0,
            "base_rainfall": rf.current_rainfall if rf else 35.0,
            "forecast": rf.forecast_rainfall if rf else 45.0,
            "drain_id": dz.drain_id if dz else "DR-101",
            "blockage_pct": dz.blockage_percentage if dz else 0.0,
            "water_accumulation": l.water_accumulation_level
        }
        computed = compute_zone_risk(data_dict)
        results.append(computed)
    return results

@router.get("")
def get_risk_zones(city: str = Query("Hyderabad"), db: Session = Depends(get_db)):
    zones = build_zone_dicts(db, city)
    return {
        "city": city,
        "count": len(zones),
        "zones": zones
    }

@router.get("/{location_id}")
def get_single_zone(location_id: int, db: Session = Depends(get_db)):
    loc = db.query(Location).filter(Location.id == location_id).first()
    if not loc:
        return {"error": "Location not found"}
    dz = db.query(DrainageZone).filter(DrainageZone.location_id == loc.id).first()
    rf = db.query(RainfallRecord).filter(RainfallRecord.location_id == loc.id).first()
    data_dict = {
        "id": loc.id,
        "name": loc.name,
        "city": loc.city,
        "latitude": loc.latitude,
        "longitude": loc.longitude,
        "elevation": loc.elevation,
        "slope": loc.slope,
        "impervious": loc.impervious_surface,
        "historical_flood_freq": loc.historical_flood_frequency,
        "capacity": dz.max_capacity if dz else 70.0,
        "base_load": dz.current_load if dz else 40.0,
        "base_rainfall": rf.current_rainfall if rf else 35.0,
        "forecast": rf.forecast_rainfall if rf else 45.0,
        "drain_id": dz.drain_id if dz else "DR-101",
        "blockage_pct": dz.blockage_percentage if dz else 0.0,
        "water_accumulation": loc.water_accumulation_level
    }
    return compute_zone_risk(data_dict)
