import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
    mean_absolute_percentage_error
)

def train_and_save_model():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(base_dir, "..", "..", ".."))
    
    csv_path = os.path.join(project_root, "TCS_Historical_Data.csv")
    if not os.path.exists(csv_path):
        csv_path = os.path.join(base_dir, "TCS_Historical_Data.csv")
        
    print(f"Loading dataset from: {csv_path}")
    df = pd.read_csv(csv_path)
    
    if 'Date' in df.columns:
        df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
        df = df.sort_values('Date').reset_index(drop=True)
    
    required_cols = ['Open', 'High', 'Low', 'Volume', 'Close']
    for col in required_cols:
        if col not in df.columns:
            raise ValueError(f"Missing required column: {col}")
    
    df = df.dropna(subset=required_cols)
    df = df[(df['Open'] > 0) & (df['High'] > 0) & (df['Low'] > 0) & (df['Close'] > 0)]
    
    X = df[['Open', 'High', 'Low', 'Volume']]
    y = df['Close']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, shuffle=True)
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    model = LinearRegression()
    model.fit(X_train_scaled, y_train)
    
    y_pred = model.predict(X_test_scaled)
    
    mae = float(mean_absolute_error(y_test, y_pred))
    mse = float(mean_squared_error(y_test, y_pred))
    rmse = float(np.sqrt(mse))
    rss = float(np.sum((y_test - y_pred) ** 2))
    mape = float(mean_absolute_percentage_error(y_test, y_pred))
    r2 = float(r2_score(y_test, y_pred))
    
    n = len(y_test)
    p = X_test.shape[1]
    adj_r2 = float(1 - (1 - r2) * (n - 1) / (n - p - 1))
    
    metrics = {
        "MAE": round(mae, 4),
        "MSE": round(mse, 4),
        "RMSE": round(rmse, 4),
        "RSS": round(rss, 4),
        "MAPE": round(mape * 100, 4),
        "R2": round(r2, 6),
        "Adjusted_R2": round(adj_r2, 6),
        "Total_Rows": len(df),
        "Train_Rows": len(X_train),
        "Test_Rows": len(X_test),
        "Features": list(X.columns),
        "Target": "Close",
        "Coefficients": {col: round(float(coef), 6) for col, coef in zip(X.columns, model.coef_)},
        "Intercept": round(float(model.intercept_), 6)
    }
    
    os.makedirs(base_dir, exist_ok=True)
    model_path = os.path.join(base_dir, "model.pkl")
    scaler_path = os.path.join(base_dir, "scaler.pkl")
    metrics_path = os.path.join(base_dir, "metrics.json")
    
    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)
        
    print(f"Model saved to {model_path}")
    print(f"Scaler saved to {scaler_path}")
    print(f"Metrics saved to {metrics_path}")
    print("Metrics Summary:")
    for k, v in metrics.items():
        print(f"  {k}: {v}")

if __name__ == "__main__":
    train_and_save_model()
