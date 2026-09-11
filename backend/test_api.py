import urllib.request
import json

BASE = 'http://127.0.0.1:8000'

def run_get(path):
    with urllib.request.urlopen(BASE + path) as res:
        data = json.loads(res.read().decode())
        print(f"[GET {path}] Status 200 OK - Keys: {list(data.keys())[:4]}")

def run_post(path, payload):
    req = urllib.request.Request(
        BASE + path,
        data=json.dumps(payload).encode(),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as res:
        data = json.loads(res.read().decode())
        return data

if __name__ == "__main__":
    print("Testing Backend Endpoints...")
    run_get('/health')
    run_get('/api/dashboard?city=Hyderabad')
    run_get('/api/risk-zones?city=Hyderabad')
    run_get('/api/rainfall?city=Hyderabad')
    run_get('/api/drainage?city=Hyderabad')
    run_get('/api/alerts?city=Hyderabad')
    run_get('/api/historical-data?city=Hyderabad')
    run_get('/api/reports/summary?city=Hyderabad')

    pred_data = run_post('/api/predictions/predict', {
        'rainfall_intensity': 55,
        'forecast_rainfall': 70,
        'drainage_capacity': 80,
        'drainage_utilization': 82,
        'elevation': 8.2,
        'slope': 1.5,
        'impervious_surface': 78,
        'historical_flood_frequency': 8,
        'water_accumulation': 65
    })
    print(f"[POST /api/predictions/predict] Probability: {pred_data['flood_probability']}%, Risk: {pred_data['risk_level']}")

    sim_data = test_post('/api/simulation/run', {
        'rainfall_intensity': 100,
        'forecast_rainfall': 120,
        'drainage_capacity': 50,
        'drainage_blockage': 35,
        'elevation': 8.5,
        'historical_flood_risk': 'High',
        'target_city': 'Hyderabad'
    })
    print(f"[POST /api/simulation/run] Inundation State: {sim_data['overall_city_risk']}, Critical Zones: {sim_data['critical_zones_count']}")
    print("ALL API TESTS PASSED SUCCESSFULLY!")
