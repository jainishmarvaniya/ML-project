from fastapi import APIRouter
from app.services.model_service import model_service

router = APIRouter(prefix="", tags=["Metrics"])

@router.get("/metrics", summary="Get Multiple Linear Regression Model Evaluation Metrics")
def get_model_metrics():
    return model_service.get_metrics()
