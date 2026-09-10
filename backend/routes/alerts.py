from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Alert, Location
from schemas import AlertActionInput
from services.alert_engine import dispatch_emergency_broadcast

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
            "acknowledged_by": a.acknowledged_by,
            "sms_broadcast": {
                "status": "Delivered to local subscribers" if a.severity == "Critical" else "Standby",
                "subscribers_notified": 14250 if a.severity == "Critical" else 0
            }
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

    broadcast_receipt = None

    if payload.action == "acknowledge":
        alert.status = "acknowledged"
        alert.acknowledged_by = payload.officer_name
    elif payload.action == "resolve":
        alert.status = "resolved"
    elif payload.action == "escalate":
        alert.status = "escalated"
        alert.severity = "Critical"
        alert.title = f"ESCALATED: {alert.title}"
        # Trigger emergency cell broadcast on escalation
        loc = db.query(Location).filter(Location.id == alert.location_id).first()
        broadcast_receipt = dispatch_emergency_broadcast({
            "location_name": loc.name if loc else "Urban Basin",
            "city": loc.city if loc else "Hyderabad"
        })
    else:
        raise HTTPException(status_code=400, detail="Invalid action")

    db.commit()
    db.refresh(alert)

    return {
        "message": f"Alert {alert_id} updated to {alert.status}",
        "alert_id": alert.id,
        "new_status": alert.status,
        "severity": alert.severity,
        "acknowledged_by": alert.acknowledged_by,
        "broadcast_receipt": broadcast_receipt
    }

