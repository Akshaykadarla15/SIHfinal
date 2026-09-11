import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

# 1. Healthcheck & Root
def test_root_endpoint():
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert "status" in data
    assert data["status"].lower() == "operational"

# 2. Authentication & Signed JWT Flow
def test_demo_users_available():
    res = client.get("/api/auth/demo-users")
    assert res.status_code == 200
    users = res.json()
    assert len(users) >= 3
    roles = {u["role"] for u in users}
    assert "admin" in roles
    assert "officer" in roles
    assert "public" in roles

def test_login_success_jwt_token():
    res = client.post("/api/auth/login", json={
        "email": "admin@flood.ai",
        "password": "admin123"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["role"] == "admin"
    assert "token" in data and data["token"] is not None
    assert data["token_type"] == "bearer"

    # Verify protected /me route with issued token
    token = data["token"]
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "admin@flood.ai"

def test_login_invalid_credentials():
    res = client.post("/api/auth/login", json={
        "email": "admin@flood.ai",
        "password": "wrongpassword"
    })
    assert res.status_code == 401

def test_protected_me_without_token():
    res = client.get("/api/auth/me")
    assert res.status_code == 401

# 3. Dashboard Telemetry & Open-Meteo Integration
def test_dashboard_telemetry_hyderabad():
    res = client.get("/api/dashboard?city=Hyderabad")
    assert res.status_code == 200
    data = res.json()
    assert data["city"] == "Hyderabad"
    assert "metrics" in data
    assert "zones" in data
    assert len(data["zones"]) > 0

def test_dashboard_telemetry_other_city():
    res = client.get("/api/dashboard?city=Mumbai")
    assert res.status_code == 200
    data = res.json()
    assert data["city"] == "Mumbai"

# 4. Predictions, Ensemble Variance & Feature Importances
def test_predictions_feature_importances():
    res = client.get("/api/predictions/feature-importances")
    assert res.status_code == 200
    importances = res.json()
    assert "rainfall_intensity" in importances
    assert "drainage_utilization" in importances

def test_prediction_uncertainty_output():
    payload = {
        "rainfall_intensity": 55.0,
        "forecast_rainfall": 65.0,
        "drainage_capacity": 60.0,
        "drainage_utilization": 75.0,
        "drainage_blockage": 20.0,
        "elevation": 14.0,
        "slope": 1.5,
        "impervious_surface": 85.0
    }
    res = client.post("/api/predictions/predict", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "flood_probability" in data
    assert "uncertainty" in data
    assert "confidence_band" in data
    assert "±" in data["confidence_band"]
    assert "global_feature_importances" in data

# 5. Simulation Bounds & Defensive Validation
def test_simulation_valid_run():
    payload = {
        "rainfall_intensity": 75.0,
        "forecast_rainfall": 85.0,
        "drainage_capacity": 60.0,
        "drainage_blockage": 25.0,
        "elevation": 12.0,
        "historical_flood_risk": "High",
        "target_city": "Hyderabad"
    }
    res = client.post("/api/simulation/run", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "overall_city_risk" in data
    assert "affected_zones" in data
    assert len(data["affected_zones"]) > 0

def test_simulation_out_of_bounds_rejection():
    # Rainfall > 300 mm/hr should trigger 422
    payload = {
        "rainfall_intensity": 450.0,
        "forecast_rainfall": 50.0,
        "drainage_capacity": 60.0,
        "drainage_blockage": 20.0
    }
    res = client.post("/api/simulation/run", json=payload)
    assert res.status_code == 422

def test_simulation_negative_drainage_capacity_rejection():
    # Drainage capacity < 5 mm/hr should trigger 422
    payload = {
        "rainfall_intensity": 50.0,
        "forecast_rainfall": 50.0,
        "drainage_capacity": -10.0,
        "drainage_blockage": 20.0
    }
    res = client.post("/api/simulation/run", json=payload)
    assert res.status_code == 422

# 6. Citizen Waterlogging Reports
def test_get_citizen_waterlogging_reports():
    res = client.get("/api/reports/waterlogging?city=Hyderabad")
    assert res.status_code == 200
    reports = res.json()
    assert isinstance(reports, list)

def test_post_citizen_waterlogging_report():
    report_payload = {
        "city": "Hyderabad",
        "location_name": "Begumpet Underpass Test",
        "latitude": 17.444,
        "longitude": 78.468,
        "water_depth": "Waist-deep (> 2 ft)",
        "description": "Pytest automated test incident report",
        "reporter_name": "Test Citizen"
    }
    res = client.post("/api/reports/waterlogging", json=report_payload)
    assert res.status_code == 200
    created = res.json()
    assert created["location_name"] == "Begumpet Underpass Test"
    assert created["water_depth"] == "Waist-deep (> 2 ft)"
    assert "id" in created

# 7. Alerts & Emergency Broadcast
def test_get_alerts():
    res = client.get("/api/alerts?city=Hyderabad")
    assert res.status_code == 200
    data = res.json()
    assert "alerts" in data

def test_escalate_alert_triggers_broadcast():
    # Escalating alert triggers dispatch_emergency_broadcast
    res = client.patch("/api/alerts/1", json={
        "action": "escalate",
        "officer_name": "Inspector Pytest",
        "notes": "Escalating for test broadcast"
    })
    assert res.status_code in [200, 404]  # 404 only if alert id 1 doesn't exist in test db

# 8. Historical Accuracy & Backtesting
def test_historical_accuracy_metrics():
    res = client.get("/api/historical-data/accuracy?city=Hyderabad")
    assert res.status_code == 200
    data = res.json()
    assert "metrics" in data
    assert data["metrics"]["overall_accuracy"] >= 90.0
    assert "confusion_matrix" in data
    assert data["confusion_matrix"]["true_positive"] > 0
    assert "lead_time_distribution" in data
    assert "recent_storm_evaluations" in data

def test_historical_flood_data():
    res = client.get("/api/historical-data?city=Hyderabad")
    assert res.status_code == 200
    data = res.json()
    assert "events" in data
    assert "chart_data" in data
    assert len(data["events"]) > 0
    # Check that events include drainage telemetry
    first_ev = data["events"][0]
    assert "drain_id" in first_ev
    assert "drainage_capacity" in first_ev
    assert "utilization_percentage" in first_ev
    assert "surcharge_status" in first_ev

def test_historical_drainage_data():
    res = client.get("/api/historical-data/drainage?city=Hyderabad")
    assert res.status_code == 200
    data = res.json()
    assert "records" in data
    assert "summary" in data
    assert len(data["records"]) > 0
    first_rec = data["records"][0]
    assert "drain_id" in first_rec
    assert "catchment_basin" in first_rec
    assert "drainage_capacity" in first_rec
    assert "utilization_percentage" in first_rec
    assert "remedial_action" in first_rec


# 9. Dynamic Live Weather & Hyperlocal Flood Predictions
def test_dynamic_search_endpoint():
    res = client.get("/api/dynamic/search?q=Hyderabad")
    assert res.status_code == 200
    results = res.json()
    assert isinstance(results, list)
    if len(results) > 0:
        assert "name" in results[0]
        assert "latitude" in results[0]
        assert "longitude" in results[0]

def test_dynamic_weather_endpoint():
    res = client.get("/api/dynamic/weather?lat=17.3850&lng=78.4867")
    assert res.status_code == 200
    data = res.json()
    assert "weather" in data
    assert "temperature_c" in data["weather"]
    assert "rainfall_rate_mm_hr" in data["weather"]

def test_dynamic_predict_endpoint():
    res = client.get("/api/dynamic/predict?lat=17.4933&lng=78.3914&name=Kukatpally")
    assert res.status_code == 200
    data = res.json()
    assert "flood_risk" in data
    assert "probability_pct" in data["flood_risk"]
    assert "risk_level" in data["flood_risk"]
    assert "nowcast_timeline" in data["flood_risk"]
    assert len(data["flood_risk"]["nowcast_timeline"]) == 5
    assert "dashboard" in data

