from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class PredictionInput(BaseModel):
    model: str = Field(default="Linear Regression", description="Selected regression model name")
    Open: float = Field(..., description="Opening Stock Price (today)", example=3950.0)
    High: float = Field(..., description="Day High Stock Price (today)", example=3980.0)
    Low: float = Field(..., description="Day Low Stock Price (today)", example=3920.0)
    Close: float = Field(..., description="Closing Stock Price (today)", example=3960.0)
    Volume: float = Field(..., description="Trading Volume (today)", example=1500000.0)

class PredictionOutput(BaseModel):
    prediction: float = Field(..., description="Predicted Next Day Closing Price")
    model: str = Field(..., description="Name of the model used")
    metrics: Dict[str, float] = Field(..., description="Evaluation metrics")
    fit: str = Field(..., description="Model fit status: Good Fit, Underfitting, Overfitting")
    training_time: float = Field(..., description="Time taken to train in seconds")
    testing_time: float = Field(..., description="Time taken to test in seconds")
    timestamp: str = Field(..., description="ISO Timestamp of prediction execution")
    chart_data: Dict[str, Any] = Field(default={}, description="Data for Plotly charts")

class EvaluationMetrics(BaseModel):
    MAE: float
    MSE: float
    RMSE: float
    RSS: float
    MAPE: float
    R2: float
    Adjusted_R2: float
    TrainScore: float
    TestScore: float

class DatasetSummary(BaseModel):
    Total_Rows: int
    Total_Columns: int
    Columns: List[str]
    Missing_Values: Dict[str, int]
    Date_Range: Dict[str, Optional[str]]
    Stats_Summary: Dict[str, Dict[str, float]]

class HistoricalRecord(BaseModel):
    Date: str
    Open: float
    High: float
    Low: float
    Close: float
    Volume: float
    Next_Day_Close: float
