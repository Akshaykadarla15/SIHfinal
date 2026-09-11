import httpx
import time
from typing import Dict, Any, List, Optional

class LiveWeatherService:
    """
    High-performance weather, elevation, and geocoding service using Open-Meteo APIs.
    100% Free, requires NO API key, and provides hyper-local rainfall and storm telemetry.
    """
    def __init__(self):
        self._cache = {}
        self.CACHE_TTL = 300  # 5 minutes cache

    async def get_elevation(self, lat: float, lng: float) -> float:
        """Fetch elevation in meters above sea level."""
        cache_key = f"elev_{round(lat, 4)}_{round(lng, 4)}"
        if cache_key in self._cache and (time.time() - self._cache[cache_key]["time"] < 86400):
            return self._cache[cache_key]["data"]

        url = f"https://api.open-meteo.com/v1/elevation?latitude={lat}&longitude={lng}"
        try:
            async with httpx.AsyncClient(timeout=6.0) as client:
                res = await client.get(url)
                if res.status_code == 200:
                    data = res.json()
                    elevation = float(data.get("elevation", [25.0])[0])
                    self._cache[cache_key] = {"data": elevation, "time": time.time()}
                    return elevation
        except Exception as e:
            print(f"Error fetching elevation: {e}")
        return 25.0  # Fallback default elevation

    async def get_live_weather(self, lat: float, lng: float) -> Dict[str, Any]:
        """Fetch live precipitation, storm CAPE index, wind gusts, and soil moisture."""
        cache_key = f"weather_{round(lat, 3)}_{round(lng, 3)}"
        if cache_key in self._cache and (time.time() - self._cache[cache_key]["time"] < self.CACHE_TTL):
            return self._cache[cache_key]["data"]

        url = (
            f"https://api.open-meteo.com/v1/forecast?"
            f"latitude={lat}&longitude={lng}&"
            f"current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m,wind_gusts_10m,surface_pressure&"
            f"hourly=precipitation_probability,precipitation,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,cape&"
            f"forecast_days=2&timezone=auto"
        )

        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.get(url)
                if res.status_code == 200:
                    raw = res.json()
                    current = raw.get("current", {})
                    hourly = raw.get("hourly", {})

                    # Extract rainfall telemetry
                    precip_mm = float(current.get("precipitation", 0.0))
                    hourly_precip = hourly.get("precipitation", [])
                    past_3h_rain = sum(hourly_precip[:3]) if len(hourly_precip) >= 3 else precip_mm * 2.5
                    peak_forecast_rain = max(hourly_precip[:12]) if hourly_precip else precip_mm * 1.4

                    # Extract storm indices
                    wind_speed = float(current.get("wind_speed_10m", 12.0))
                    wind_gusts = float(current.get("wind_gusts_10m", 18.0))
                    cape_list = hourly.get("cape", [])
                    current_cape = float(cape_list[0]) if cape_list else 150.0

                    # Soil moisture saturation (0 to 1 m3/m3)
                    sm_list = hourly.get("soil_moisture_0_to_1cm", [])
                    soil_moisture = float(sm_list[0]) if sm_list else 0.28

                    # Storm classification
                    if precip_mm >= 50.0 or current_cape >= 2500.0:
                        storm_class = "Severe Deluge / Cloudburst Emergency"
                    elif precip_mm >= 25.0 or current_cape >= 1500.0:
                        storm_class = "Heavy Downpour / Thunderstorm Warning"
                    elif precip_mm >= 7.5 or current_cape >= 600.0:
                        storm_class = "Moderate Rain / Storm Watch"
                    else:
                        storm_class = "Normal / Light Showers"

                    result = {
                        "source": "Open-Meteo Live API",
                        "temperature_c": float(current.get("temperature_2m", 28.0)),
                        "humidity_pct": float(current.get("relative_humidity_2m", 75.0)),
                        "rainfall_rate_mm_hr": precip_mm,
                        "accumulated_rain_3h_mm": round(past_3h_rain, 1),
                        "peak_forecast_rain_mm_hr": round(peak_forecast_rain, 1),
                        "wind_speed_kmh": wind_speed,
                        "wind_gusts_kmh": wind_gusts,
                        "cape_storm_index": current_cape,
                        "soil_moisture_m3_m3": round(soil_moisture, 3),
                        "pressure_hpa": float(current.get("surface_pressure", 1012.0)),
                        "storm_classification": storm_class,
                        "timestamp": time.time()
                    }
                    self._cache[cache_key] = {"data": result, "time": time.time()}
                    return result
        except Exception as e:
            print(f"Error fetching live weather: {e}")

        # Graceful fallback baseline
        return {
            "source": "Estimated Baseline (Offline Fallback)",
            "temperature_c": 28.5,
            "humidity_pct": 78.0,
            "rainfall_rate_mm_hr": 14.5,
            "accumulated_rain_3h_mm": 28.0,
            "peak_forecast_rain_mm_hr": 22.0,
            "wind_speed_kmh": 15.0,
            "wind_gusts_kmh": 24.0,
            "cape_storm_index": 450.0,
            "soil_moisture_m3_m3": 0.32,
            "pressure_hpa": 1011.0,
            "storm_classification": "Moderate Showers",
            "timestamp": time.time()
        }

    async def search_locations(self, query: str) -> List[Dict[str, Any]]:
        """Search worldwide cities and localities using Open-Meteo Geocoding."""
        if not query or len(query.strip()) < 2:
            return []

        url = f"https://geocoding-api.open-meteo.com/v1/search?name={query.strip()}&count=8&language=en&format=json"
        try:
            async with httpx.AsyncClient(timeout=6.0) as client:
                res = await client.get(url)
                if res.status_code == 200:
                    data = res.json()
                    results = []
                    for item in data.get("results", []):
                        results.append({
                            "id": item.get("id"),
                            "name": item.get("name"),
                            "admin1": item.get("admin1", ""),
                            "country": item.get("country", ""),
                            "latitude": float(item.get("latitude")),
                            "longitude": float(item.get("longitude")),
                            "elevation": float(item.get("elevation", 20.0))
                        })
                    return results
        except Exception as e:
            print(f"Geocoding search error: {e}")
        return []

live_weather_service = LiveWeatherService()
