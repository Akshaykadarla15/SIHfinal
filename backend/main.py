import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from seed_data import seed_database
from routes import (
    auth,
    dashboard,
    risk_zones,
    rainfall,
    drainage,
    predictions,
    simulation,
    alerts,
    historical,
    reports
)

# Initialize FastAPI application
app = FastAPI(
    title="Urban Flood Nowcasting System API",
    description="AI-powered early warning & hydrological risk nowcasting platform for Smart India Hackathon (SIH)",
    version="1.0.0"
)

# Configure CORS for local development and production frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For prototype versatility
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event: Ensure database tables and initial demo data are ready
@app.on_event("startup")
def on_startup():
    print("Verifying database and seeding demo records...")
    Base.metadata.create_all(bind=engine)
    seed_database()
    print("Backend initialization complete.")

# Include sub-routers
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(risk_zones.router)
app.include_router(rainfall.router)
app.include_router(drainage.router)
app.include_router(predictions.router)
app.include_router(simulation.router)
app.include_router(alerts.router)
app.include_router(historical.router)
app.include_router(reports.router)

@app.get("/")
def root():
    return {
        "system": "Urban Flood Nowcasting System",
        "status": "Operational",
        "version": "1.0.0",
        "mode": "SIH Prototype / Demo Active",
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "connected"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
