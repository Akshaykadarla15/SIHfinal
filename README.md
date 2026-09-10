# Urban Flood Nowcasting System
**AI-Powered Early Warning & Hydrological Flash Flood Prediction Platform**  
*Developed for Smart India Hackathon (SIH) Prototype Demonstration*

---

## 🌊 1. Project Overview & Problem Statement

Urban flash flooding is a recurrent, devastating challenge across rapidly expanding metropolitan cities in India (such as Hyderabad, Mumbai, Delhi, and Chennai). Rapid concretization, inadequate drainage discharge capacity, low-lying topography, and sudden cloudburst events lead to intense localized waterlogging within 15 to 45 minutes—often before emergency civic authorities can respond.

Existing municipal approaches rely on delayed ground reports or coarse regional weather alerts. **The Urban Flood Nowcasting System** bridges this critical gap by fusing:
1. **Live & Forecast Rainfall Rates** (Automatic Weather Stations / IMD Doppler Radar)
2. **Storm Water Drainage Capacity & Channel Load** (Hydraulic culvert telemetry)
3. **Terrain Topography & Slope Elevation** (Digital Elevation Models / GIS)
4. **Impervious Concrete Surface Fraction** (Urban land-use coefficients)
5. **Historical Monsoonal Flood Records** (Past empirical inundation frequencies)

This multi-layer data stream powers a **Random Forest Hydrological AI Model** that predicts flood probability in **nowcasting windows (0–15 min, 15–30 min, 30–60 min, 1–2 hours, 2–3 hours)**, visualizes risk overlays on an interactive city map, generates actionable Explainable AI (XAI) factor attributions, and issues immediate incident-command and public citizen warnings.

---

## ✨ 2. Key Features

- **Responsive Public Safety Light Theme**: Clean, professional government dashboard aesthetics with a strict light palette (crisp white, light blues, soft greens for Safe 0–25%, yellows for Moderate 25–50%, oranges for High 50–75%, and reds strictly for Critical 75–100% alerts).
- **Interactive Leaflet GIS Risk Map**: Dynamic colored circle overlays representing localized inundation footprints, pulsing critical markers, drainage outfall traces, and one-click zone inspectors.
- **Explainable AI (XAI)**: Answers *"Why is this area at risk?"* by decomposing predictions into physical driver percentages (*Heavy rainfall %, Drainage overload %, Low terrain %, Historical frequency %, Impervious cover %*).
- **Flood Scenario Simulator (SIH Presentation Highlight)**: Interactive sliders allowing evaluators to simulate 10–150 mm/hr cloudbursts, varying drainage capacities, and 0–100% culvert blockages with instant recalculations.
- **Instant "DEMO MODE" Heavy Rainfall Trigger**: One-click button in the header that simulates an extreme 105 mm/hr deluge across all city basins to demonstrate instant nowcasting and alert generation.
- **Multi-Role Municipal Workflows**:
  - **Disaster Authority / Admin**: Strategic city overview, scenario simulation, escalation controls, and printable official bulletins.
  - **Zonal Field Officer**: Culvert blockage inspections, de-watering pump deployment, and ground reporting.
  - **Public Citizen Portal**: Searchable local area risk status, inundation timing, and plain-language road safety checklists.
- **Data Provider Abstraction**: Modular architecture supporting `DemoDataProvider` (with realistic configurations for Hyderabad, Mumbai, Delhi, and Chennai), with extension stubs for `WeatherAPIProvider` and `SensorDataProvider` (IoT water depth sensors).
- **Executive Reporting & Export**: Formatted municipal disaster management bulletins with printable layout and instant CSV data export.

---

## 🛠️ 3. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Vanilla CSS Design System, Leaflet.js, Recharts, Lucide Icons, Axios |
| **Backend** | Python 3.14+, FastAPI, Uvicorn, SQLAlchemy, Pydantic |
| **AI / ML** | scikit-learn (Random Forest Classifier, 120 Estimators), NumPy, Pandas, Joblib |
| **Database** | SQLite (auto-migrating and auto-seeding) |
| **GIS / Mapping** | Leaflet.js with CartoDB Positron / OpenStreetMap light tiles |

---

## 📐 4. System Architecture & Hydrological AI Pipeline

```
[ Rainfall Gauges / Doppler Radar ]    [ Storm Drain Sensors ]    [ Digital Elevation / GIS ]
               │                                  │                            │
               └────────────────────────┬─────────┴────────────────────────────┘
                                        ▼
                           [ DataProvider Abstraction ]
                           (Demo / Live API / IoT MQTT)
                                        │
                                        ▼
                            [ Hydrological Pipeline ]
                      (Rational Runoff Q = C * I * A)
                                        │
                                        ▼
                    [ Random Forest Model (120 Estimators) ]
                                        │
                 ┌──────────────────────┴──────────────────────┐
                 ▼                                             ▼
     [ Flood Probability (0-100%) ]                 [ Explainable AI (XAI) ]
     [ Nowcast Windows (15m to 3h) ]                (Factor Impact Breakdown)
                 │                                             │
                 └──────────────────────┬──────────────────────┘
                                        ▼
                           [ FastAPI REST Services ]
                                        │
                 ┌──────────────────────┼──────────────────────┐
                 ▼                      ▼                      ▼
        [ Leaflet Risk Map ]    [ Alerts Engine ]    [ Scenario Simulator ]
                 │                      │                      │
                 └──────────────────────┼──────────────────────┘
                                        ▼
                         [ React Light-Themed UI ]
```

---

## 👥 5. Demo Credentials

The prototype includes pre-configured demo user accounts with tailored permissions:

| Role | Email | Password | Full Name & Title |
|---|---|---|---|
| **Admin / Authority** | `admin@flood.ai` | `admin123` | Shri R. K. Sharma (Disaster Management Lead) |
| **Field Officer** | `officer@flood.ai` | `officer123` | Insp. Vikram Rao (Zonal Response Chief) |
| **Public Citizen** | `user@flood.ai` | `user123` | Ananya Reddy (Resident User) |

*(You can switch between these roles anytime using the user profile menu in the header).*

---

## 💻 6. Installation & Execution Guide (Windows)

### Prerequisites
- Python 3.10+ installed
- Node.js 18+ and npm installed

### Step A: Backend Setup & Execution
Open PowerShell:
```powershell
# Navigate to backend folder
cd backend

# Install Python dependencies
pip install -r requirements.txt

# (Optional) Retrain ML Model & Seed Database
python ml/train_model.py
python seed_data.py

# Start FastAPI backend server on port 8000
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
*The backend API will be live at `http://127.0.0.1:8000` (Interactive Swagger Docs: `http://127.0.0.1:8000/docs`).*

### Step B: Frontend Setup & Execution
Open a second PowerShell terminal:
```powershell
# Navigate to frontend folder
cd frontend

# Install npm packages
npm install

# Start Vite development server
npm run dev
```
*The frontend web dashboard will be accessible at `http://localhost:5173`.*

---

## 🏆 7. SIH Presentation Demonstration Flow (10 Steps)

Follow this exact flow during your hackathon jury demonstration:

1. **Step 1 - Landing Page**: Open `http://localhost:5173`. Highlight the clear problem statement and the core formula: *Rainfall + Drainage + Terrain + AI → Early Warning*.
2. **Step 2 - Enter Dashboard**: Click **"View Live Dashboard"**. Point out the 6 clear summary metric cards and the light-themed public safety aesthetic.
3. **Step 3 - Explore Risk Map**: Point out how low-lying basins (Begumpet, Kukatpally, Tolichowki) are identified in Orange/Red, while elevated regions (Gachibowli, Miyapur) remain Green/Safe.
4. **Step 4 - Inspect High-Risk Locality**: Click on **Kukatpally** on the map. Show the exact telemetry: *Rainfall 52 mm/hr, Drainage Load 80%, Flood Probability 82%, Expected Time: 15–30 minutes*.
5. **Step 5 - Explainable AI (XAI)**: Click **"Why is this area at risk? (Explainable AI)"**. Demonstrate how the Random Forest model decomposes the prediction into heavy rainfall (85%), drainage overload (78%), and low elevation (84%).
6. **Step 6 - Trigger Instant Demo**: Click **"Simulate Heavy Rainfall"** in the top header banner. Watch the dashboard instantly update: rainfall surges to 105 mm/hr, overall city risk becomes **CRITICAL**, and new critical alarms are raised.
7. **Step 7 - Interactive Scenario Simulator**: Navigate to **"Scenario Simulator"** on the sidebar. Adjust the sliders:
   - Rainfall Intensity = `100 mm/hr`
   - Drainage Capacity = `50 mm/hr`
   - Drainage Blockage = `35%`
   - Click **"RUN SIMULATION"**.
8. **Step 8 - Inspect AI Nowcasting Output**: View the immediate calculation: *City Inundation State: CRITICAL, 5 Critical Basins identified, 15–30 minutes lead time*.
9. **Step 9 - Emergency Incident Command**: Navigate to **"Active Alerts"**. Demonstrate acknowledging an alert, escalating to critical, or marking an issue as resolved.
10. **Step 10 - Public Citizen Portal & Reports**: Open **"Public Portal"** to show citizen safety advisories, then visit **"Reports"** to print or download the official municipal CSV bulletin.

---

## 🔮 8. Future Roadmap & Production Scaling

1. **IoT Sensor Integration**: Ingest real-time ultrasonic water-level telemetry from stormwater outfalls via MQTT/LoRaWAN.
2. **High-Resolution Drone DEMs**: Ingest centimetre-scale LiDAR/drone elevation models for micro-topographic curb-level flow routing.
3. **Crowdsourced Citizen Telemetry**: Enable geo-tagged citizen photo uploads of localized puddle depths to continuously fine-tune the AI model.
4. **Automated Cell Broadcast SMS**: Connect to national NDMA/State Disaster Management Cell Broadcast gateways for geo-fenced emergency SMS pushes.

---

*Built for Smart India Hackathon (SIH) — Smart Early Warning for Urban Flood Resilience.*
