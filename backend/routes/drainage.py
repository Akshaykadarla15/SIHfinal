from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Location, DrainageZone
from schemas import DrainageUpdateInput

router = APIRouter(prefix="/api/drainage", tags=["Drainage Monitoring"])

@router.get("")
def get_drainage_monitoring(city: str = Query("Hyderabad"), db: Session = Depends(get_db)):
    records = (
        db.query(DrainageZone, Location)
        .join(Location, DrainageZone.location_id == Location.id)
        .filter(Location.city == city)
        .all()
    )

    zones = []
    normal_cnt = 0
    warning_cnt = 0
    critical_cnt = 0

    for dz, loc in records:
        if dz.status == "Critical":
            critical_cnt += 1
        elif dz.status == "Warning":
            warning_cnt += 1
        else:
            normal_cnt += 1

        zones.append({
            "id": dz.id,
            "drain_id": dz.drain_id,
            "location_id": loc.id,
            "location_name": loc.name,
            "latitude": loc.latitude,
            "longitude": loc.longitude,
            "max_capacity": dz.max_capacity,
            "current_load": dz.current_load,
            "utilization_percentage": dz.utilization_percentage,
            "blockage_status": dz.blockage_status,
            "blockage_percentage": dz.blockage_percentage,
            "overflow_risk": dz.overflow_risk,
            "status": dz.status,
            "last_inspection": dz.last_inspection,
            "reported_by": dz.reported_by or "Disaster Management Cell"
        })

    return {
        "city": city,
        "summary": {
            "total_drains": len(zones),
            "critical_drains": critical_cnt,
            "warning_drains": warning_cnt,
            "normal_drains": normal_cnt,
            "average_utilization": round(sum(z["utilization_percentage"] for z in zones) / max(len(zones), 1), 1)
        },
        "drains": zones
    }

@router.post("/update")
def update_drainage_status(update_data: DrainageUpdateInput, db: Session = Depends(get_db)):
    dz = db.query(DrainageZone).filter(DrainageZone.drain_id == update_data.drain_id).first()
    if not dz:
        raise HTTPException(status_code=404, detail="Drainage ID not found")

    dz.blockage_status = update_data.blockage_status
    dz.blockage_percentage = update_data.blockage_percentage
    dz.reported_by = update_data.reported_by

    # Recalculate status and overflow risk
    if update_data.blockage_percentage >= 50.0 or dz.utilization_percentage > 85.0:
        dz.status = "Critical"
        dz.overflow_risk = "Critical"
    elif update_data.blockage_percentage >= 25.0 or dz.utilization_percentage > 65.0:
        dz.status = "Warning"
        dz.overflow_risk = "High"
    else:
        dz.status = "Normal"
        dz.overflow_risk = "Low"

    db.commit()
    db.refresh(dz)

    return {
        "message": f"Drainage zone {dz.drain_id} updated successfully by {dz.reported_by}",
        "updated_zone": {
            "drain_id": dz.drain_id,
            "blockage_status": dz.blockage_status,
            "blockage_percentage": dz.blockage_percentage,
            "status": dz.status,
            "overflow_risk": dz.overflow_risk
        }
    }
