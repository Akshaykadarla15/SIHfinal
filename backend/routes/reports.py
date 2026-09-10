import io
import csv
import datetime
from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session
from database import get_db
from routes.risk_zones import build_zone_dicts
from services.flood_calculator import aggregate_city_risk
from models import Alert, Location

router = APIRouter(prefix="/api/reports", tags=["Municipal Reports"])

@router.get("/summary")
def get_report_summary(city: str = Query("Hyderabad"), report_type: str = Query("daily"), db: Session = Depends(get_db)):
    zones = build_zone_dicts(db, city)
    agg = aggregate_city_risk(zones)

    now_str = datetime.datetime.utcnow().strftime("%d %B %Y, %I:%M %p UTC")

    high_risk_zones = [z for z in zones if z["risk_level"] in ["High", "Critical"]]

    return {
        "report_title": f"MUNICIPAL URBAN FLOOD RISK ASSESSMENT BULLETIN - {city.upper()}",
        "generated_at": now_str,
        "report_type": report_type,
        "city": city,
        "author": "Disaster Management & Flood Control Cell",
        "executive_summary": {
            "overall_status": agg["overall_city_risk"],
            "max_rainfall_recorded": f"{agg['max_rainfall_current']} mm/hr",
            "forecast_peak": f"{agg['max_rainfall_forecast']} mm/hr",
            "drainage_reserve": f"{agg['drainage_available_pct']}%",
            "critical_areas_count": agg["critical_zones_count"],
            "high_risk_areas_count": agg["high_risk_zones_count"],
            "safe_areas_count": agg["safe_zones_count"]
        },
        "high_risk_zones": high_risk_zones,
        "all_zones": zones,
        "recommendations": [
            "Maintain 24/7 dewatering pump deployment at Begumpet, Kukatpally, and Tolichowki basins.",
            "Deploy municipal marshals to redirect traffic from submerged railway underpasses.",
            "Issue public warning bulletins via regional SMS gateway and social alert handles.",
            "Inspect DR-HYD-102 and DR-HYD-112 culverts for trash and debris clearance."
        ]
    }

@router.get("/download-csv")
def download_csv_report(city: str = Query("Hyderabad"), db: Session = Depends(get_db)):
    zones = build_zone_dicts(db, city)

    output = io.StringIO()
    writer = csv.writer(output)

    # Header
    writer.writerow([
        "Zone Name", "City", "Latitude", "Longitude", "Current Rainfall (mm/hr)",
        "Forecast (mm/hr)", "Drainage Capacity (mm/hr)", "Drainage Utilization (%)",
        "Drainage Blockage (%)", "Elevation (m)", "Flood Probability (%)",
        "Risk Level", "Predicted Flood Window", "Recommended Action"
    ])

    for z in zones:
        writer.writerow([
            z["name"], z["city"], z["latitude"], z["longitude"],
            z["rainfall_rate"], z["forecast_rainfall"], z["drainage_capacity"],
            z["drainage_utilization"], z["drainage_blockage"], z["elevation"],
            z["flood_probability"], z["risk_level"], z["predicted_time"],
            z["recommended_action"]
        ])

    response = Response(content=output.getvalue(), media_type="text/csv")
    response.headers["Content-Disposition"] = f"attachment; filename=Flood_Risk_Report_{city}_{datetime.date.today()}.csv"
    return response
