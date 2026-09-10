import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from typing import Dict, Any, List
from ml.predict import predict_flood_risk, classify_risk

def compute_zone_risk(
    location: Dict[str, Any],
    rainfall_override: float = None,
    forecast_override: float = None,
    capacity_override: float = None,
    blockage_override: float = None
) -> Dict[str, Any]:
    """
    Computes flood probability, risk category, expected time, XAI factors,
    and nowcasting timeline for a specific location.
    """
    rainfall = rainfall_override if rainfall_override is not None else location.get("base_rainfall", 40.0)
    forecast = forecast_override if forecast_override is not None else location.get("forecast", rainfall * 1.25)
    capacity = capacity_override if capacity_override is not None else location.get("capacity", 75.0)
    blockage = blockage_override if blockage_override is not None else location.get("blockage_pct", 5.0)

    effective_cap = max(10.0, capacity * (1.0 - blockage / 100.0))
    impervious = location.get("impervious", location.get("impervious_surface", 75.0))
    runoff_load = rainfall * (impervious / 100.0)
    drainage_utilization = round(min(150.0, (runoff_load / effective_cap) * 100.0), 1)

    elevation = location.get("elevation", 14.0)
    slope = location.get("slope", 2.0)
    hist_freq = location.get("historical_flood_freq", location.get("historical_flood_frequency", 6.0))

    water_accumulation = round(min(100.0, max(10.0, (drainage_utilization * 0.6) + (10.0 / max(elevation, 4.0)) * 25.0)), 1)

    pred_input = {
        "rainfall_intensity": rainfall,
        "forecast_rainfall": forecast,
        "cumulative_rainfall": rainfall * 2.2,
        "drainage_capacity": capacity,
        "drainage_utilization": drainage_utilization,
        "drainage_blockage": blockage,
        "elevation": elevation,
        "slope": slope,
        "impervious_surface": impervious,
        "historical_flood_frequency": hist_freq,
        "water_accumulation": water_accumulation
    }

    pred_output = predict_flood_risk(pred_input)

    return {
        "location_id": location.get("id", 1),
        "name": location.get("name", "Unknown Zone"),
        "city": location.get("city", "Hyderabad"),
        "latitude": location.get("latitude", location.get("lat", 17.4)),
        "longitude": location.get("longitude", location.get("lng", 78.4)),
        "elevation": elevation,
        "slope": slope,
        "rainfall_rate": rainfall,
        "forecast_rainfall": forecast,
        "drainage_capacity": capacity,
        "drainage_load": round(runoff_load, 1),
        "drainage_utilization": drainage_utilization,
        "drainage_blockage": blockage,
        "drain_id": location.get("drain_id", "DR-101"),
        "water_accumulation": location.get("water_accumulation", "Moderate"),
        "flood_probability": pred_output["flood_probability"],
        "risk_level": pred_output["risk_level"],
        "predicted_time": pred_output["predicted_time"],
        "recommended_action": pred_output["recommended_action"],
        "xai_factors": pred_output["xai_factors"],
        "nowcast_timeline": pred_output["nowcast_timeline"],
        "confidence_score": pred_output["confidence_score"]
    }

def aggregate_city_risk(zones: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Summarizes city-wide flood risk and zone counts.
    """
    safe_cnt = sum(1 for z in zones if z["risk_level"] == "Safe")
    mod_cnt = sum(1 for z in zones if z["risk_level"] == "Moderate")
    high_cnt = sum(1 for z in zones if z["risk_level"] == "High")
    crit_cnt = sum(1 for z in zones if z["risk_level"] == "Critical")

    max_rain = max((z["rainfall_rate"] for z in zones), default=0.0)
    max_forecast = max((z["forecast_rainfall"] for z in zones), default=0.0)
    avg_drain_util = sum(z["drainage_utilization"] for z in zones) / max(len(zones), 1)
    drainage_avail_pct = round(max(0.0, 100.0 - avg_drain_util), 1)

    if crit_cnt > 0:
        overall = "CRITICAL"
    elif high_cnt > 0:
        overall = "HIGH"
    elif mod_cnt > 0:
        overall = "MODERATE"
    else:
        overall = "SAFE"

    return {
        "overall_city_risk": overall,
        "critical_zones_count": crit_cnt,
        "high_risk_zones_count": high_cnt,
        "moderate_zones_count": mod_cnt,
        "safe_zones_count": safe_cnt,
        "max_rainfall_current": round(max_rain, 1),
        "max_rainfall_forecast": round(max_forecast, 1),
        "drainage_available_pct": drainage_avail_pct
    }
