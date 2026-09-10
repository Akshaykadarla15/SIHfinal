from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class PredictionInput(BaseModel):
    rainfall_intensity: float = Field(..., ge=0, le=300, description="Current rainfall rate in mm/hr")
    forecast_rainfall: float = Field(..., ge=0, le=300, description="Forecasted rainfall rate in mm/hr")
    drainage_capacity: float = Field(..., ge=5, le=300, description="Design drainage capacity in mm/hr")
    drainage_utilization: float = Field(..., ge=0, le=150, description="Current drainage capacity utilized in %")
    elevation: float = Field(default=15.0, description="Elevation above mean sea level in meters")
    slope: float = Field(default=2.0, description="Terrain slope gradient in %")
    impervious_surface: float = Field(default=75.0, ge=0, le=100, description="Impervious surface fraction in %")
    historical_flood_frequency: float = Field(default=6.0, ge=0, le=10, description="Historical flood susceptibility index 0-10")
    water_accumulation: float = Field(default=50.0, ge=0, le=100, description="Estimated current surface ponding in %")
    drainage_blockage: float = Field(default=10.0, ge=0, le=100, description="Estimated drain blockage %")

class NowcastWindow(BaseModel):
    window: str  # "0-15 min", "15-30 min", "30-60 min", "1-2 hours", "2-3 hours"
    probability: float
    risk_level: str

class XAIFactors(BaseModel):
    heavy_rainfall: float
    drainage_overload: float
    low_elevation: float
    historical_risk: float
    impervious_surface: float

class PredictionOutput(BaseModel):
    flood_probability: float
    risk_level: str
    predicted_time: str
    recommended_action: str
    confidence_score: float = 94.2
    xai_factors: XAIFactors
    nowcast_timeline: List[NowcastWindow]

class SimulationInput(BaseModel):
    rainfall_intensity: float = Field(..., ge=10, le=150)
    forecast_rainfall: float = Field(..., ge=10, le=150)
    drainage_capacity: float = Field(..., ge=10, le=150)
    drainage_blockage: float = Field(..., ge=0, le=100)
    elevation: Optional[float] = 12.0
    historical_flood_risk: Optional[str] = "High"
    target_city: Optional[str] = "Hyderabad"

class AffectedZoneSummary(BaseModel):
    location_id: int
    name: str
    latitude: float
    longitude: float
    rainfall: float
    drainage_load_pct: float
    flood_probability: float
    risk_level: str
    predicted_time: str
    elevation: float
    recommendation: str

class SimulationResult(BaseModel):
    simulated_rainfall: float
    simulated_drainage_capacity: float
    simulated_blockage: float
    overall_city_risk: str
    critical_zones_count: int
    high_risk_zones_count: int
    moderate_zones_count: int
    safe_zones_count: int
    affected_zones: List[AffectedZoneSummary]
    general_recommendation: str

class AlertActionInput(BaseModel):
    action: str  # "acknowledge", "resolve", "escalate"
    officer_name: Optional[str] = "Field Officer"
    notes: Optional[str] = None

class DrainageUpdateInput(BaseModel):
    drain_id: str
    blockage_status: str  # "Clear", "Minor", "Suspected", "Severe"
    blockage_percentage: float
    reported_by: Optional[str] = "Field Team"

class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    role: str
    name: str
    badge: Optional[str] = None
