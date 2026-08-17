import sys
import os

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
try:
    from app.routers import predict, metrics, dataset
except ImportError:
    from routers import predict, metrics, dataset


app = FastAPI(
    title="TCS Stock Price Prediction API",
    description="Production-ready Multiple Linear Regression API for TCS Stock Price Prediction",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for dev/production flexibility
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers with both root and /api prefixes
app.include_router(predict.router)
app.include_router(predict.router, prefix="/api")
app.include_router(metrics.router)
app.include_router(metrics.router, prefix="/api")
app.include_router(dataset.router)
app.include_router(dataset.router, prefix="/api")

@app.get("/", summary="Health Check and API Metadata")
@app.get("/api", summary="Health Check and API Metadata")
@app.get("/api/index.py", summary="Health Check and API Metadata")
def root():
    return {
        "status": "online",
        "service": "TCS Stock Price Prediction API",
        "algorithm": "Multiple Regression Models",
        "author": "Senior AI Full Stack Engineer",
        "endpoints": [
            "GET /",
            "POST /predict",
            "GET /metrics",
            "GET /dataset-info",
            "GET /dataset"
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
