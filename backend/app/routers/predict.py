from fastapi import APIRouter, HTTPException, status
from typing import List, Dict, Any
from app.schemas.predict_schema import PredictionInput, PredictionOutput, RecommendInput, RecommendOutput
from app.services.model_service import model_service

router = APIRouter(prefix="", tags=["Prediction"])

@router.get(
    "/models",
    response_model=List[str],
    summary="Get Available Models",
    description="Returns a list of all available regression models that can be used for prediction."
)
def get_available_models():
    return model_service.get_available_models()

@router.post(
    "/predict",
    response_model=PredictionOutput,
    summary="Predict TCS Next Day Closing Price",
    description="Trains the selected model and predicts the next day's closing price.",
)
def predict_stock_price(payload: PredictionInput):
    try:
        input_features = {
            "Open": payload.Open,
            "High": payload.High,
            "Low": payload.Low,
            "Close": payload.Close,
            "Volume": payload.Volume,
        }
        result = model_service.train_and_predict(
            model_name=payload.model,
            input_features=input_features
        )
        return result
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}",
        )

@router.post(
    "/compare",
    response_model=List[Dict[str, Any]],
    summary="Compare All Models",
    description="Trains all models and returns a leaderboard sorted by R2 score."
)
def compare_models():
    try:
        result = model_service.compare_models()
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Comparison failed: {str(e)}",
        )

@router.post(
    "/recommend",
    summary="Get AI Model Recommendation",
    description="Analyzes all models using cross-validation and recommends the best one for the given input."
)
def recommend_model(payload: RecommendInput):
    try:
        input_features = {
            "Open": payload.Open,
            "High": payload.High,
            "Low": payload.Low,
            "Close": payload.Close,
            "Volume": payload.Volume,
        }
        result = model_service.recommend_model(input_features)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Recommendation failed: {str(e)}",
        )
