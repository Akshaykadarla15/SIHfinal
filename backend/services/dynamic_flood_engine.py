import math
import time
from typing import Dict, Any, List

class DynamicFloodEngine:
    """
    Hydrological Flash Flood Predictor for any global coordinate.
    Calculates surface runoff, Topographic Inundation Susceptibility, and Nowcast time horizons.
    """
    def calculate_risk(
        self,
        lat: float,
        lng: float,
        location_name: str,
        elevation: float,
        weather: Dict[str, Any],
        urban_impervious_fraction: float = 0.82
    ) -> Dict[str, Any]:
        rainfall_rate = float(weather.get("rainfall_rate_mm_hr", 0.0))
        accumulated_rain = float(weather.get("accumulated_rain_3h_mm", 0.0))
        soil_moisture = float(weather.get("soil_moisture_m3_m3", 0.30))
        cape = float(weather.get("cape_storm_index", 200.0))
        forecast_rain = float(weather.get("peak_forecast_rain_mm_hr", rainfall_rate * 1.3))

        # 1. Effective Runoff Coefficient (Adjusted for Soil Moisture Saturation)
        saturation_multiplier = 1.0 + max(0.0, (soil_moisture - 0.30) * 2.5)
        c_effective = min(0.98, urban_impervious_fraction * saturation_multiplier)

        # 2. Runoff Inflow vs Standard Urban Drain Capacity (assuming 45 mm/h design baseline)
        drainage_capacity = 45.0
        runoff_rate = c_effective * (rainfall_rate + (accumulated_rain * 0.15))
        drainage_utilization = min(200.0, (runoff_rate / drainage_capacity) * 100.0)

        # 3. Topographic Inundation Susceptibility Index (TISI)
        # Relative elevation: depressions (elevation < 15m or lower than surrounding reference) suffer rapid pooling
        elevation_factor = max(0.0, min(100.0, (35.0 - min(35.0, elevation)) * 2.8))

        # 4. Multi-Factor Flood Probability Computation
        score = (
            (min(100.0, (rainfall_rate / 60.0) * 100.0) * 0.35) +
            (min(100.0, (runoff_rate / drainage_capacity) * 100.0) * 0.25) +
            (elevation_factor * 0.20) +
            (min(100.0, (soil_moisture / 0.45) * 100.0) * 0.10) +
            (min(100.0, (cape / 2500.0) * 100.0) * 0.10)
        )
        probability = round(min(98.5, max(4.0, score)), 1)

        # 5. Risk Categorization
        if probability >= 75.0:
            risk_level = "Critical"
            est_time = "15 to 30 minutes"
            water_depth_cm = round(max(25.0, runoff_rate * 0.5), 1)
            water_accumulation = "Severe"
        elif probability >= 50.0:
            risk_level = "High"
            est_time = "30 to 60 minutes"
            water_depth_cm = round(max(10.0, runoff_rate * 0.3), 1)
            water_accumulation = "High"
        elif probability >= 25.0:
            risk_level = "Moderate"
            est_time = "1 to 2 hours (if rain persists)"
            water_depth_cm = round(runoff_rate * 0.15, 1)
            water_accumulation = "Moderate"
        else:
            risk_level = "Safe"
            est_time = "No Inundation Expected"
            water_depth_cm = 0.0
            water_accumulation = "Low"

        # 6. Nowcasting Time Windows (0-15m, 15-30m, 30-60m, 1-2h, 2-3h)
        nowcast_timeline = [
            {"window": "0-15 min", "probability": round(min(99.0, probability * 0.90), 1), "risk_level": self._classify(probability * 0.90)},
            {"window": "15-30 min", "probability": round(min(99.0, probability * 1.05), 1), "risk_level": self._classify(probability * 1.05)},
            {"window": "30-60 min", "probability": round(min(99.0, probability * 1.12), 1), "risk_level": self._classify(probability * 1.12)},
            {"window": "1-2 hours", "probability": round(min(99.0, probability * 1.08), 1), "risk_level": self._classify(probability * 1.08)},
            {"window": "2-3 hours", "probability": round(min(99.0, probability * 0.95), 1), "risk_level": self._classify(probability * 0.95)}
        ]

        # 7. Explainable AI (XAI) Attribution Breakdown
        xai_factors = {
            "heavy_rainfall": round(min(99.0, max(5.0, (rainfall_rate / 60.0) * 100.0)), 1),
            "drainage_overload": round(min(99.0, max(5.0, drainage_utilization)), 1),
            "low_elevation": round(min(99.0, max(5.0, elevation_factor)), 1),
            "historical_risk": round(min(95.0, max(10.0, probability * 0.85)), 1),
            "impervious_surface": round(urban_impervious_fraction * 100.0, 1)
        }

        # 8. Actionable Recommendations
        if risk_level in ["Critical", "High"]:
            action = f"EMERGENCY: Barricade underpasses and low-lying roads near {location_name}. Deploy high-capacity mobile dewatering pumps."
        elif risk_level == "Moderate":
            action = f"ADVISORY: Monitor storm drain outfalls and clear culvert grates across {location_name}."
        else:
            action = f"NORMAL: Hydrological runoff is within design thresholds. Continue standard monitoring."

        # Construct single zone representation compatible with frontend
        zone_data = {
            "location_id": 9999,
            "name": location_name,
            "city": location_name,
            "latitude": lat,
            "longitude": lng,
            "elevation": round(elevation, 1),
            "slope": 1.8,
            "rainfall_rate": round(rainfall_rate, 1),
            "forecast_rainfall": round(forecast_rain, 1),
            "drainage_capacity": drainage_capacity,
            "drainage_load": round(runoff_rate, 1),
            "drainage_utilization": round(drainage_utilization, 1),
            "drainage_blockage": 15.0,
            "drain_id": f"DR-DYN-{abs(int(lat * 100))}",
            "water_accumulation": water_accumulation,
            "flood_probability": probability,
            "risk_level": risk_level,
            "predicted_time": est_time,
            "recommended_action": action,
            "xai_factors": xai_factors,
            "nowcast_timeline": nowcast_timeline
        }

        # Construct full dashboard-compatible payload
        available_drainage = max(0.0, 100.0 - drainage_utilization)
        active_alerts = []
        if risk_level in ["Critical", "High"]:
            active_alerts.append({
                "id": 9901,
                "title": f"FLASH FLOOD WARNING: {location_name}",
                "severity": risk_level,
                "location_name": location_name,
                "created_at": "Just now",
                "recommended_action": action,
                "status": "active"
            })

        warning_banner = None
        if risk_level == "Critical":
            warning_banner = f"⚠️ CRITICAL INUNDATION ALERT for {location_name}: Rainfall ({rainfall_rate} mm/hr) exceeds stormwater discharge capacity!"
        elif risk_level == "High":
            warning_banner = f"⚠️ HIGH RISK ALERT for {location_name}: High runoff and soil saturation detected."

        # 6-hour rainfall trend
        now_hour = int(time.strftime("%H"))
        trend = []
        for i in range(6):
            h = (now_hour - 5 + i) % 24
            r = max(0.0, round(rainfall_rate * (0.6 + (i * 0.1)), 1)) if rainfall_rate > 0 else (5.0 if i == 5 else 2.0)
            trend.append({
                "time": f"{h:02d}:00",
                "rainfall": r,
                "threshold": 40.0
            })

        dashboard_payload = {
            "city": location_name,
            "current_time": time.strftime("%I:%M:%S %p IST"),
            "metrics": {
                "current_rainfall": f"{rainfall_rate:.1f} mm/hr",
                "current_rainfall_val": rainfall_rate,
                "max_rainfall_forecast": f"{forecast_rain:.1f} mm/hr",
                "max_rainfall_forecast_val": forecast_rain,
                "high_risk_zones": "1 Area" if risk_level == "High" else "0 Areas",
                "high_risk_zones_count": 1 if risk_level == "High" else 0,
                "critical_zones": "1 Area" if risk_level == "Critical" else "0 Areas",
                "critical_zones_count": 1 if risk_level == "Critical" else 0,
                "drainage_capacity": f"{available_drainage:.0f}% Available",
                "drainage_available_pct": round(available_drainage, 1),
                "overall_city_risk": risk_level.upper()
            },
            "warning_banner": warning_banner,
            "zones": [zone_data],
            "active_alerts": active_alerts,
            "rainfall_trend": trend,
            "weather_details": weather
        }

        return {
            "location": {
                "name": location_name,
                "latitude": lat,
                "longitude": lng,
                "elevation_m": round(elevation, 1)
            },
            "weather": weather,
            "zone": zone_data,
            "flood_risk": {
                "probability_pct": probability,
                "risk_level": risk_level,
                "drainage_utilization_pct": round(drainage_utilization, 1),
                "estimated_time_to_inundation": est_time,
                "predicted_water_depth_cm": water_depth_cm,
                "nowcast_timeline": nowcast_timeline,
                "xai_factors": xai_factors,
                "actionable_recommendations": [action]
            },
            "dashboard": dashboard_payload
        }

    def _classify(self, prob: float) -> str:
        if prob >= 75.0: return "Critical"
        if prob >= 50.0: return "High"
        if prob >= 25.0: return "Moderate"
        return "Safe"

dynamic_flood_engine = DynamicFloodEngine()
