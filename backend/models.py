import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(120), unique=True, index=True, nullable=False)
    password = Column(String(120), nullable=False)
    role = Column(String(30), default="public")  # "admin", "officer", "public"
    name = Column(String(120), nullable=False)
    badge = Column(String(50), nullable=True)

class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    city = Column(String(50), index=True, default="Hyderabad")
    name = Column(String(100), unique=True, index=True, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation = Column(Float, default=15.0)  # in meters
    slope = Column(Float, default=2.0)  # in %
    impervious_surface = Column(Float, default=70.0)  # in %
    historical_flood_frequency = Column(Float, default=5.0)  # 1 to 10 scale
    base_drainage_capacity = Column(Float, default=65.0)  # mm/hr
    water_accumulation_level = Column(String(20), default="Moderate")  # Low, Moderate, High, Severe

    rainfall_records = relationship("RainfallRecord", back_populates="location", cascade="all, delete-orphan")
    drainage_zones = relationship("DrainageZone", back_populates="location", cascade="all, delete-orphan")
    predictions = relationship("RiskPrediction", back_populates="location", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="location", cascade="all, delete-orphan")
    historical_floods = relationship("HistoricalFlood", back_populates="location", cascade="all, delete-orphan")

class RainfallRecord(Base):
    __tablename__ = "rainfall_data"

    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    current_rainfall = Column(Float, nullable=False)  # mm/hr
    rainfall_last_1h = Column(Float, default=0.0)
    rainfall_last_3h = Column(Float, default=0.0)
    rainfall_last_6h = Column(Float, default=0.0)
    forecast_rainfall = Column(Float, default=0.0)
    intensity_status = Column(String(50), default="Moderate")  # "Light", "Moderate", "Heavy", "Torrential"
    trend = Column(String(50), default="Rapidly Increasing")  # "Decreasing", "Stable", "Increasing", "Rapidly Increasing"

    location = relationship("Location", back_populates="rainfall_records")

class DrainageZone(Base):
    __tablename__ = "drainage_data"

    id = Column(Integer, primary_key=True, index=True)
    drain_id = Column(String(30), unique=True, nullable=False)  # e.g. "DR-102"
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    max_capacity = Column(Float, nullable=False)  # mm/hr
    current_load = Column(Float, nullable=False)  # mm/hr
    utilization_percentage = Column(Float, nullable=False)
    blockage_status = Column(String(50), default="Clear")  # "Clear", "Minor", "Suspected", "Severe"
    blockage_percentage = Column(Float, default=0.0)
    overflow_risk = Column(String(30), default="Low")  # "Low", "Moderate", "High", "Critical"
    status = Column(String(30), default="Normal")  # "Normal", "Warning", "Critical"
    last_inspection = Column(String(50), default="Today, 08:30 AM")
    reported_by = Column(String(100), nullable=True)

    location = relationship("Location", back_populates="drainage_zones")

class RiskPrediction(Base):
    __tablename__ = "risk_predictions"

    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    flood_probability = Column(Float, nullable=False)  # 0 to 100
    risk_level = Column(String(30), nullable=False)  # "Safe", "Moderate", "High", "Critical"
    predicted_time = Column(String(50), default="30-45 minutes")
    recommended_action = Column(Text, nullable=False)
    xai_heavy_rainfall = Column(Float, default=40.0)
    xai_drainage_overload = Column(Float, default=30.0)
    xai_low_elevation = Column(Float, default=15.0)
    xai_historical_risk = Column(Float, default=15.0)
    nowcast_timeline = Column(Text, nullable=True)  # JSON string of windows

    location = relationship("Location", back_populates="predictions")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    title = Column(String(150), nullable=False)
    severity = Column(String(30), nullable=False)  # "Safe", "Moderate", "High", "Critical"
    flood_probability = Column(Float, nullable=False)
    expected_time = Column(String(50), default="30-45 minutes")
    reason = Column(Text, nullable=False)
    recommended_action = Column(Text, nullable=False)
    status = Column(String(30), default="active")  # "active", "acknowledged", "resolved", "escalated"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    acknowledged_by = Column(String(100), nullable=True)

    location = relationship("Location", back_populates="alerts")

class HistoricalFlood(Base):
    __tablename__ = "historical_floods"

    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    event_date = Column(String(50), nullable=False)
    rainfall_mm = Column(Float, nullable=False)
    peak_water_level = Column(Float, nullable=False)  # in meters
    flood_duration_hours = Column(Float, nullable=False)
    severity = Column(String(30), default="High")  # "Moderate", "High", "Severe"
    drainage_performance = Column(String(50), default="Submerged")
    damage_reported = Column(Text, nullable=True)

    location = relationship("Location", back_populates="historical_floods")
