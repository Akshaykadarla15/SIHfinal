from fastapi import APIRouter
from schemas import PredictionInput, PredictionOutput
from ml.predict import predict_flood_risk, get_model_feature_importances, METADATA_PATH

router = APIRouter(prefix="/api/predictions", tags=["AI Predictions"])

@router.post("/predict", response_model=PredictionOutput)
def predict_nowcast(data: PredictionInput):
    input_dict = data.model_dump()
    result = predict_flood_risk(input_dict)
    return PredictionOutput(**result)

@router.get("/feature-importances")
def get_feature_importances():
    """
    Returns the real global feature importances extracted from model_metadata.json
    and the trained Random Forest model.
    """
    return get_model_feature_importances()

@router.get("/model-info")
def get_model_info():
    if os.path.exists(METADATA_PATH):
        with open(METADATA_PATH, "r") as f:
            return json.load(f)
    return {
        "model_type": "RandomForestClassifier",
        "features": 11,
        "status": "Ready"
    }
