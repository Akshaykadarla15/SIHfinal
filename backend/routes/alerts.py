from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Alert, Location
from schemas import AlertActionInput

router = APIRouter(prefix="/api/alerts", tags=["Emergency Alerts"])

@router.get("")
def get_alerts(city: str = Query("Hyderabad"), status: str = Query(None), db: Session = Depends(get_db)):
    query = (
        db.query(Alert, Location)
        .join(Location, Alert.location_id == Location.id)
        .filter(Location.city == city)
    )

    if status:
        query = query.filter(Alert.status == status)

    records = query.order_by(Alert.flood_probability.desc()).all()

    alert_list = []
    for a, loc in records:
        alert_list.append({
            "id": a.id,
            "title": a.title,
            "location_id": loc.id,
            "location_name": loc.name,
            "city": loc.city,
            "severity": a.severity,
            "flood_probability": a.flood_probability,
            "expected_time": a.expected_time,
            "reason": a.reason,
            "recommended_action": a.recommended_action,
            "status": a.status,
            "created_at": a.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "acknowledged_by": a.acknowledged_by
        })

    return {
        "city": city,
        "total_alerts": len(alert_list),
        "critical_count": sum(1 for x in alert_list if x["severity"] == "Critical"),
        "high_count": sum(1 for x in alert_list if x["severity"] == "High"),
        "alerts": alert_list
    }

@router.post("/{alert_id}/action")
def update_alert_action(alert_id: int, payload: AlertActionInput, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    if payload.action == "acknowledge":
        alert.status = "acknowledged"
        alert.acknowledged_by = payload.officer_name
    elif payload.action == "resolve":
        alert.status = "resolved"
    elif payload.action == "escalate":
        alert.status = "escalated"
        alert.severity = "Critical"
        alert.title = f"ESCALATED: {alert.title}"
    else:
        raise HTTPException(status_code=400, detail="Invalid action")

    db.commit()
    db.refresh(alert)

    return {
        "message": f"Alert {alert_id} updated to {alert.status}",
        "alert_id": alert.id,
        "new_status": alert.status,
        "severity": alert.severity,
        "acknowledged_by": alert.acknowledged_by
    }
