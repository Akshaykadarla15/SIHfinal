import datetime
from typing import List, Dict, Any

def dispatch_emergency_broadcast(alert: Dict[str, Any]) -> Dict[str, Any]:
    """
    Mocked SMS & WhatsApp Cell Broadcast gateway triggered for Critical flood warnings.
    Simulates sending emergency SMS to all telecom subscriber towers in the affected zone.
    """
    zone_name = alert.get("location_name") or alert.get("name") or "Urban Basin"
    city = alert.get("city", "Hyderabad")
    recipients = 14250 if "Begumpet" in zone_name else (18400 if "Kukatpally" in zone_name else 12500)

    sms_text = f"🚨 EMERGENCY FLOOD WARNING ({city.upper()} DISASTER CELL): Severe inundation imminent in {zone_name} within 15-30 mins. Underpasses blocked. Stay indoors. Emergency Helpline: 112 / 040-21111111."

    print("=" * 70)
    print(f"[MUNICIPAL BROADCAST GATEWAY] Dispatched Emergency SMS / WhatsApp to {recipients:,} residents in {zone_name}!")
    print(f"Payload Text: \"{sms_text}\"")
    print(f"Carriers: Airtel, Jio, BSNL Cell Broadcast • Delivery Status: 100% Confirmed")
    print("=" * 70)

    return {
        "dispatched": True,
        "broadcast_channel": "Emergency Cell Broadcast (SMS & WhatsApp Flash)",
        "recipients_count": recipients,
        "towers_targeted": [f"{city[:3].upper()}-TOW-101", f"{city[:3].upper()}-TOW-104"],
        "dispatch_timestamp": datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
        "delivery_status": "DELIVERED",
        "sms_sample": sms_text
    }

def generate_alerts_from_zones(zones: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Generates structured emergency alerts for zones crossing risk thresholds:
    - Probability < 25%: No alert
    - 25-50%: Monitor Advisory
    - 50-75%: High Alert / Warning
    - > 75%: Critical Flood Warning (triggers automated SMS/WhatsApp broadcast dispatch)
    """
    alerts = []
    alert_id = 100

    for z in sorted(zones, key=lambda x: x["flood_probability"], reverse=True):
        prob = z["flood_probability"]
        if prob < 25.0:
            continue

        broadcast_receipt = None

        if prob >= 75.0:
            severity = "Critical"
            title = f"CRITICAL FLOOD WARNING: {z['name']}"
            reason = f"Torrential rainfall ({z['rainfall_rate']} mm/hr) coupled with heavy drainage saturation ({z['drainage_utilization']}%) and low terrain ({z['elevation']}m)."
            action = "Deploy emergency field personnel, close vulnerable underpasses, and issue traffic diversions immediately."
            # Trigger emergency telecom broadcast for Critical warnings
            broadcast_receipt = dispatch_emergency_broadcast({
                "location_name": z["name"],
                "city": z.get("city", "Hyderabad"),
                "rainfall_rate": z["rainfall_rate"]
            })
        elif prob >= 50.0:
            severity = "High"
            title = f"HIGH FLOOD ALERT: {z['name']}"
            reason = f"Sustained heavy rainfall ({z['rainfall_rate']} mm/hr) exceeding localized storm drain capacity ({z['drainage_capacity']} mm/hr)."
            action = "Alert zonal storm water management teams and stage mobile de-watering pumps."
        else:
            severity = "Moderate"
            title = f"WATERLOGGING ADVISORY: {z['name']}"
            reason = f"Moderate rainfall ({z['rainfall_rate']} mm/hr) approaching drainage threshold ({z['drainage_utilization']}% utilization)."
            action = "Monitor rainfall progression and maintain patrol along major transit routes."

        alert_id += 1
        alerts.append({
            "id": alert_id,
            "location_id": z.get("location_id", alert_id),
            "title": title,
            "location_name": z["name"],
            "city": z.get("city", "Hyderabad"),
            "severity": severity,
            "flood_probability": prob,
            "expected_time": z["predicted_time"],
            "reason": reason,
            "recommended_action": action,
            "drain_id": z.get("drain_id", "DR-101"),
            "status": "active",
            "created_at": datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
            "acknowledged_by": None,
            "broadcast_receipt": broadcast_receipt
        })

    return alerts
