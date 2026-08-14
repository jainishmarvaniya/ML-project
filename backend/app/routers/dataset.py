from fastapi import APIRouter, Query
from app.services.model_service import model_service

router = APIRouter(prefix="", tags=["Dataset"])

@router.get("/dataset-info", summary="Get Dataset Metadata, Row Count, Missing Values & Stats")
def get_dataset_info():
    return model_service.get_dataset_info()

@router.get("/dataset", summary="Get Historical Dataset Records")
def get_dataset_records(limit: int = Query(1000, ge=1, le=6000), skip: int = Query(0, ge=0)):
    return {
        "total": model_service.df.shape[0] if model_service.df is not None else 0,
        "limit": limit,
        "skip": skip,
        "records": model_service.get_dataset_records(limit=limit, skip=skip)
    }
