import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, roc_auc_score, classification_report
from generate_synthetic_data import generate_hydrology_dataset

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(CURRENT_DIR, "model.pkl")
METADATA_PATH = os.path.join(CURRENT_DIR, "model_metadata.json")

FEATURE_COLUMNS = [
    "rainfall_intensity",
    "forecast_rainfall",
    "cumulative_rainfall",
    "drainage_capacity",
    "drainage_utilization",
    "drainage_blockage",
    "elevation",
    "slope",
    "impervious_surface",
    "historical_flood_frequency",
    "water_accumulation"
]

def train_and_save_model():
    print("Generating realistic hydrology training data...")
    df = generate_hydrology_dataset(num_samples=7500, random_seed=42)

    X = df[FEATURE_COLUMNS]
    y = df["flood_occurred"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print("Training Random Forest Classifier for flood prediction...")
    clf = RandomForestClassifier(
        n_estimators=120,
        max_depth=12,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )

    clf.fit(X_train, y_train)

    # Evaluation
    y_pred = clf.predict(X_test)
    y_prob = clf.predict_proba(X_test)[:, 1]

    acc = float(accuracy_score(y_test, y_pred))
    auc = float(roc_auc_score(y_test, y_prob))
    print(f"Model Trained! Test Accuracy: {acc * 100:.2f}%, ROC-AUC: {auc:.4f}")

    # Feature importances
    importances = clf.feature_importances_
    feat_imp_dict = {
        feat: float(round(imp * 100, 2))
        for feat, imp in zip(FEATURE_COLUMNS, importances)
    }

    # Save model artifact
    joblib.dump(clf, MODEL_PATH)
    print(f"Model saved to {MODEL_PATH}")

    # Save metadata
    metadata = {
        "model_type": "RandomForestClassifier",
        "algorithm": "scikit-learn Random Forest (120 Estimators)",
        "features": FEATURE_COLUMNS,
        "feature_importances": feat_imp_dict,
        "metrics": {
            "accuracy": round(acc * 100, 2),
            "roc_auc": round(auc, 4),
            "test_samples": len(y_test)
        },
        "dataset_type": "Simulated Hydrology Dynamics (SIH Prototype Verification)",
        "trained_at": "2026-09-10"
    }

    with open(METADATA_PATH, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"Metadata saved to {METADATA_PATH}")

    return clf, metadata

if __name__ == "__main__":
    train_and_save_model()
