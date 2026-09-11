from fastapi import APIRouter, Query, HTTPException
from services.live_weather_service import live_weather_service
from services.dynamic_flood_engine import dynamic_flood_engine

router = APIRouter(prefix="/api/dynamic", tags=["Dynamic Weather & Flood Inundation"])

@router.get("/search")
async def search_locations(q: str = Query(..., min_length=2, description="Search term for city or locality")):
    """Global autocomplete search for any city or locality worldwide."""
    try:
        results = await live_weather_service.search_locations(q)
        return results
    except Exception as e:
        print(f"Error in /api/dynamic/search: {e}")
        return []

@router.get("/weather")
async def get_weather(lat: float = Query(...), lng: float = Query(...)):
    """Fetch live meteorological, storm CAPE, wind gusts, and soil moisture for exact coordinates."""
    try:
        weather = await live_weather_service.get_live_weather(lat, lng)
        elevation = await live_weather_service.get_elevation(lat, lng)
        return {
            "latitude": lat,
            "longitude": lng,
            "elevation_m": elevation,
            "weather": weather
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch weather: {str(e)}")

@router.get("/predict")
async def predict_flood(
    lat: float = Query(...),
    lng: float = Query(...),
    name: str = Query(default="Current Location")
):
    """
    Predict real-time flash flood probability, nowcasting timeline, and return
    a full dashboard-compatible payload for any latitude and longitude.
    """
    try:
        weather = await live_weather_service.get_live_weather(lat, lng)
        elevation = await live_weather_service.get_elevation(lat, lng)
        result = dynamic_flood_engine.calculate_risk(lat, lng, name, elevation, weather)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to calculate flood risk: {str(e)}")
