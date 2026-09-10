import datetime
from typing import List, Dict, Any

def generate_alerts_from_zones(zones: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Generates structured emergency alerts for zones crossing risk thresholds:
    - Probability < 25%: No alert
    - 25-50%: Monitor Advisory
    - 50-75%: High Alert / Warning
    - > 75%: Critical Flood Warning
    """
    alerts = []
    alert_id = 100

    for z in sorted(zones, key=lambda x: x["flood_probability"], reverse=True):
        prob = z["flood_probability"]
        if prob < 25.0:
            continue

        if prob >= 75.0:
            severity = "Critical"
            title = f"CRITICAL FLOOD WARNING: {z['name']}"
            reason = f"Torrential rainfall ({z['rainfall_rate']} mm/hr) coupled with heavy drainage saturation ({z['drainage_utilization']}%) and low terrain ({z['elevation']}m)."
            action = "Deploy emergency field personnel, close vulnerable underpasses, and issue traffic diversions immediately."
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
            "acknowledged_by": None
        })

    return alerts
