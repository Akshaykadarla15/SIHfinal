import abc
from typing import List, Dict, Any

class DataProvider(abc.ABC):
    """
    Abstract Base Class for hydrological and meteorological data ingestion.
    Allows seamlessly swapping between Demo data, Live Weather APIs, and IoT sensors.
    """

    @abc.abstractmethod
    def get_locations(self, city: str = "Hyderabad") -> List[Dict[str, Any]]:
        pass

    @abc.abstractmethod
    def get_rainfall_data(self, location_id: int) -> Dict[str, Any]:
        pass

    @abc.abstractmethod
    def get_drainage_data(self, location_id: int) -> Dict[str, Any]:
        pass

class DemoDataProvider(DataProvider):
    """
    SIH Prototype Demo Data Provider.
    Configured with realistic topography, drainage IDs, and flood susceptibility
    for Indian metropolitan cities (Hyderabad default, Mumbai, Delhi, Chennai).
    """

    CITIES_DATA = {
        "Hyderabad": [
            {
                "name": "Kukatpally",
                "lat": 17.4933,
                "lng": 78.3914,
                "elevation": 8.2,
                "slope": 1.4,
                "impervious": 84.0,
                "historical_flood_freq": 9.0,
                "drain_id": "DR-HYD-102",
                "capacity": 80.0,
                "base_load": 64.0,
                "base_rainfall": 52.0,
                "forecast": 68.0,
                "water_accumulation": "High"
            },
            {
                "name": "Madhapur",
                "lat": 17.4483,
                "lng": 78.3915,
                "elevation": 18.5,
                "slope": 3.2,
                "impervious": 78.0,
                "historical_flood_freq": 5.0,
                "drain_id": "DR-HYD-105",
                "capacity": 75.0,
                "base_load": 38.0,
                "base_rainfall": 34.0,
                "forecast": 42.0,
                "water_accumulation": "Moderate"
            },
            {
                "name": "Gachibowli",
                "lat": 17.4401,
                "lng": 78.3489,
                "elevation": 24.0,
                "slope": 4.1,
                "impervious": 68.0,
                "historical_flood_freq": 3.0,
                "drain_id": "DR-HYD-108",
                "capacity": 90.0,
                "base_load": 28.0,
                "base_rainfall": 26.0,
                "forecast": 32.0,
                "water_accumulation": "Low"
            },
            {
                "name": "Begumpet",
                "lat": 17.4447,
                "lng": 78.4664,
                "elevation": 7.5,
                "slope": 1.1,
                "impervious": 88.0,
                "historical_flood_freq": 9.5,
                "drain_id": "DR-HYD-112",
                "capacity": 65.0,
                "base_load": 58.0,
                "base_rainfall": 58.0,
                "forecast": 74.0,
                "water_accumulation": "Severe"
            },
            {
                "name": "LB Nagar",
                "lat": 17.3457,
                "lng": 78.5522,
                "elevation": 12.0,
                "slope": 2.0,
                "impervious": 80.0,
                "historical_flood_freq": 7.5,
                "drain_id": "DR-HYD-115",
                "capacity": 70.0,
                "base_load": 52.0,
                "base_rainfall": 48.0,
                "forecast": 60.0,
                "water_accumulation": "High"
            },
            {
                "name": "Secunderabad",
                "lat": 17.4399,
                "lng": 78.4983,
                "elevation": 14.5,
                "slope": 2.5,
                "impervious": 75.0,
                "historical_flood_freq": 6.0,
                "drain_id": "DR-HYD-120",
                "capacity": 75.0,
                "base_load": 44.0,
                "base_rainfall": 38.0,
                "forecast": 46.0,
                "water_accumulation": "Moderate"
            },
            {
                "name": "Mehdipatnam",
                "lat": 17.3916,
                "lng": 78.4419,
                "elevation": 9.0,
                "slope": 1.6,
                "impervious": 82.0,
                "historical_flood_freq": 8.0,
                "drain_id": "DR-HYD-124",
                "capacity": 65.0,
                "base_load": 54.0,
                "base_rainfall": 50.0,
                "forecast": 65.0,
                "water_accumulation": "High"
            },
            {
                "name": "Ameerpet",
                "lat": 17.4375,
                "lng": 78.4482,
                "elevation": 11.2,
                "slope": 1.8,
                "impervious": 86.0,
                "historical_flood_freq": 7.0,
                "drain_id": "DR-HYD-128",
                "capacity": 70.0,
                "base_load": 48.0,
                "base_rainfall": 44.0,
                "forecast": 55.0,
                "water_accumulation": "Moderate"
            },
            {
                "name": "Uppal",
                "lat": 17.4022,
                "lng": 78.5602,
                "elevation": 10.5,
                "slope": 1.5,
                "impervious": 79.0,
                "historical_flood_freq": 7.5,
                "drain_id": "DR-HYD-132",
                "capacity": 72.0,
                "base_load": 46.0,
                "base_rainfall": 41.0,
                "forecast": 50.0,
                "water_accumulation": "Moderate"
            },
            {
                "name": "Miyapur",
                "lat": 17.4968,
                "lng": 78.3547,
                "elevation": 16.0,
                "slope": 2.8,
                "impervious": 72.0,
                "historical_flood_freq": 4.5,
                "drain_id": "DR-HYD-136",
                "capacity": 85.0,
                "base_load": 32.0,
                "base_rainfall": 28.0,
                "forecast": 36.0,
                "water_accumulation": "Low"
            },
            {
                "name": "Tolichowki",
                "lat": 17.4019,
                "lng": 78.4073,
                "elevation": 6.8,
                "slope": 0.9,
                "impervious": 89.0,
                "historical_flood_freq": 9.2,
                "drain_id": "DR-HYD-140",
                "capacity": 60.0,
                "base_load": 56.0,
                "base_rainfall": 56.0,
                "forecast": 72.0,
                "water_accumulation": "Severe"
            },
            {
                "name": "Khairatabad",
                "lat": 17.4116,
                "lng": 78.4608,
                "elevation": 13.0,
                "slope": 2.2,
                "impervious": 76.0,
                "historical_flood_freq": 6.5,
                "drain_id": "DR-HYD-144",
                "capacity": 74.0,
                "base_load": 42.0,
                "base_rainfall": 36.0,
                "forecast": 45.0,
                "water_accumulation": "Moderate"
            }
        ],
        "Mumbai": [
            {"name": "Hindmata (Dadar)", "lat": 19.0178, "lng": 72.8478, "elevation": 4.2, "slope": 0.5, "impervious": 92.0, "historical_flood_freq": 10.0, "drain_id": "DR-MUM-201", "capacity": 60.0, "base_load": 58.0, "base_rainfall": 64.0, "forecast": 82.0, "water_accumulation": "Severe"},
            {"name": "Kurla West", "lat": 19.0688, "lng": 72.8797, "elevation": 5.1, "slope": 0.7, "impervious": 90.0, "historical_flood_freq": 9.8, "drain_id": "DR-MUM-205", "capacity": 65.0, "base_load": 61.0, "base_rainfall": 60.0, "forecast": 78.0, "water_accumulation": "Severe"},
            {"name": "Bandra Kurla Complex", "lat": 19.0607, "lng": 72.8687, "elevation": 9.4, "slope": 1.8, "impervious": 85.0, "historical_flood_freq": 6.0, "drain_id": "DR-MUM-210", "capacity": 85.0, "base_load": 48.0, "base_rainfall": 45.0, "forecast": 58.0, "water_accumulation": "Moderate"},
            {"name": "Andheri Subway", "lat": 19.1197, "lng": 72.8464, "elevation": 3.8, "slope": 0.4, "impervious": 94.0, "historical_flood_freq": 10.0, "drain_id": "DR-MUM-215", "capacity": 55.0, "base_load": 54.0, "base_rainfall": 68.0, "forecast": 86.0, "water_accumulation": "Severe"}
        ],
        "Delhi": [
            {"name": "ITO Junction", "lat": 28.6289, "lng": 77.2412, "elevation": 8.0, "slope": 1.0, "impervious": 89.0, "historical_flood_freq": 8.8, "drain_id": "DR-DEL-301", "capacity": 70.0, "base_load": 55.0, "base_rainfall": 48.0, "forecast": 62.0, "water_accumulation": "High"},
            {"name": "Minto Bridge", "lat": 28.6341, "lng": 77.2255, "elevation": 4.5, "slope": 0.6, "impervious": 93.0, "historical_flood_freq": 10.0, "drain_id": "DR-DEL-305", "capacity": 50.0, "base_load": 48.0, "base_rainfall": 55.0, "forecast": 70.0, "water_accumulation": "Severe"},
            {"name": "Kashmere Gate", "lat": 28.6679, "lng": 77.2301, "elevation": 7.2, "slope": 1.2, "impervious": 86.0, "historical_flood_freq": 8.0, "drain_id": "DR-DEL-310", "capacity": 65.0, "base_load": 49.0, "base_rainfall": 46.0, "forecast": 58.0, "water_accumulation": "High"}
        ],
        "Chennai": [
            {"name": "Velachery", "lat": 12.9815, "lng": 80.2180, "elevation": 5.0, "slope": 0.6, "impervious": 91.0, "historical_flood_freq": 9.7, "drain_id": "DR-CHN-401", "capacity": 58.0, "base_load": 55.0, "base_rainfall": 62.0, "forecast": 80.0, "water_accumulation": "Severe"},
            {"name": "Mudichur", "lat": 12.9154, "lng": 80.0634, "elevation": 6.5, "slope": 0.9, "impervious": 83.0, "historical_flood_freq": 9.2, "drain_id": "DR-CHN-405", "capacity": 62.0, "base_load": 53.0, "base_rainfall": 54.0, "forecast": 70.0, "water_accumulation": "Severe"},
            {"name": "T. Nagar", "lat": 13.0418, "lng": 80.2341, "elevation": 7.8, "slope": 1.1, "impervious": 94.0, "historical_flood_freq": 8.5, "drain_id": "DR-CHN-410", "capacity": 65.0, "base_load": 50.0, "base_rainfall": 48.0, "forecast": 64.0, "water_accumulation": "High"}
        ]
    }

    def get_locations(self, city: str = "Hyderabad") -> List[Dict[str, Any]]:
        return self.CITIES_DATA.get(city, self.CITIES_DATA["Hyderabad"])

    def get_rainfall_data(self, location_id: int) -> Dict[str, Any]:
        return {}

    def get_drainage_data(self, location_id: int) -> Dict[str, Any]:
        return {}

class WeatherAPIProvider(DataProvider):
    """
    Adapter for external meteorological APIs (e.g. OpenWeatherMap, IMD, AccuWeather).
    Requires setting API_KEY in production .env.
    """
    def __init__(self, api_key: str = None):
        self.api_key = api_key

    def get_locations(self, city: str = "Hyderabad") -> List[Dict[str, Any]]:
        # Fallback to Demo provider if no active API key
        return DemoDataProvider().get_locations(city)

    def get_rainfall_data(self, location_id: int) -> Dict[str, Any]:
        return {}

    def get_drainage_data(self, location_id: int) -> Dict[str, Any]:
        return {}

class SensorDataProvider(DataProvider):
    """
    Adapter for IoT Municipal Flood Sensors (Ultrasonic water depth & Tipping bucket rain gauges).
    """
    def __init__(self, mqtt_broker: str = None):
        self.mqtt_broker = mqtt_broker

    def get_locations(self, city: str = "Hyderabad") -> List[Dict[str, Any]]:
        return DemoDataProvider().get_locations(city)

    def get_rainfall_data(self, location_id: int) -> Dict[str, Any]:
        return {}

    def get_drainage_data(self, location_id: int) -> Dict[str, Any]:
        return {}
