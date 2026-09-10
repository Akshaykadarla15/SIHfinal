import os
import numpy as np
import pandas as pd

def generate_hydrology_dataset(num_samples=5000, random_seed=42):
    """
    Generates a realistic synthetic hydrological dataset for urban flood nowcasting.
    Reflects the physics of urban runoff (Rational formula Q = C * I * A),
    drainage pipe surcharge, surface ponding, and topography.
    
    IMPORTANT: Prototype/Simulated data clearly labeled for SIH demonstration.
    """
    np.random.seed(random_seed)

    # 1. Rainfall features (monsoon precipitation patterns)
    rainfall_intensity = np.random.gamma(shape=2.5, scale=18.0, size=num_samples)  # 5 to 130+ mm/hr
    rainfall_intensity = np.clip(rainfall_intensity, 2.0, 160.0)

    forecast_rainfall = rainfall_intensity * np.random.normal(1.1, 0.25, size=num_samples)
    forecast_rainfall = np.clip(forecast_rainfall, 2.0, 180.0)

    cumulative_rainfall = rainfall_intensity * np.random.uniform(1.2, 3.8, size=num_samples)

    # 2. Terrain & Surface characteristics
    elevation = np.random.uniform(4.0, 45.0, size=num_samples)  # low-lying underpasses to elevated ridges
    slope = np.random.uniform(0.3, 6.0, size=num_samples)  # terrain slope in %
    impervious_surface = np.random.uniform(45.0, 95.0, size=num_samples)  # concrete cover %
    historical_flood_freq = np.random.choice([1, 2, 3, 5, 7, 8, 9, 10], size=num_samples, p=[0.1, 0.15, 0.15, 0.2, 0.15, 0.1, 0.1, 0.05])

    # 3. Drainage infrastructure
    drainage_capacity = np.random.uniform(35.0, 110.0, size=num_samples)  # design capacity in mm/hr
    drainage_blockage = np.random.choice([0, 5, 15, 25, 40, 60, 80], size=num_samples, p=[0.35, 0.25, 0.15, 0.1, 0.08, 0.05, 0.02])

    effective_capacity = drainage_capacity * (1.0 - drainage_blockage / 100.0)

    # Drainage utilization (flow rate entering drain / effective capacity)
    runoff_load = rainfall_intensity * (impervious_surface / 100.0)
    drainage_utilization = (runoff_load / np.maximum(effective_capacity, 10.0)) * 100.0
    drainage_utilization = np.clip(drainage_utilization + np.random.normal(0, 4, num_samples), 5.0, 160.0)

    # Estimated water ponding/accumulation
    excess_water = np.maximum(0, runoff_load - effective_capacity)
    water_accumulation = excess_water * (10.0 / np.maximum(elevation, 5.0)) * (1.0 / np.maximum(slope, 0.5)) * 15.0
    water_accumulation = np.clip(water_accumulation + np.random.normal(0, 5, num_samples), 0.0, 100.0)

    # 4. Latent Hydrological Risk Index (Physical equation + nonlinear surcharging)
    risk_score = (
        0.32 * (rainfall_intensity / 80.0) * 100 +
        0.18 * (forecast_rainfall / 90.0) * 100 +
        0.25 * (drainage_utilization / 100.0) * 100 +
        0.10 * (1.0 - (elevation - 4.0) / 41.0) * 100 +
        0.08 * (historical_flood_freq / 10.0) * 100 +
        0.07 * (water_accumulation / 100.0) * 100
    )

    # Add realistic environmental variance
    flood_prob = 1.0 / (1.0 + np.exp(-(risk_score - 72.0) / 12.0)) * 100.0
    flood_prob = np.clip(flood_prob + np.random.normal(0, 2.5, num_samples), 0.0, 100.0)

    # Classification label: 1 if flood occurred (probability >= 50%), else 0
    flood_occurred = (flood_prob >= 50.0).astype(int)

    # Categorical Risk
    risk_category = pd.cut(
        flood_prob,
        bins=[-1, 25, 50, 75, 101],
        labels=["Safe", "Moderate", "High", "Critical"]
    )

    df = pd.DataFrame({
        "rainfall_intensity": np.round(rainfall_intensity, 2),
        "forecast_rainfall": np.round(forecast_rainfall, 2),
        "cumulative_rainfall": np.round(cumulative_rainfall, 2),
        "drainage_capacity": np.round(drainage_capacity, 2),
        "drainage_utilization": np.round(drainage_utilization, 2),
        "drainage_blockage": np.round(drainage_blockage, 2),
        "elevation": np.round(elevation, 2),
        "slope": np.round(slope, 2),
        "impervious_surface": np.round(impervious_surface, 2),
        "historical_flood_frequency": historical_flood_freq,
        "water_accumulation": np.round(water_accumulation, 2),
        "flood_probability": np.round(flood_prob, 2),
        "flood_risk": risk_category,
        "flood_occurred": flood_occurred
    })

    return df

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(current_dir, "synthetic_flood_data.csv")
    df = generate_hydrology_dataset(6000)
    df.to_csv(output_path, index=False)
    print(f"Generated {len(df)} realistic hydrology records at {output_path}")
    print(df["flood_risk"].value_counts())
