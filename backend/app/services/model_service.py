import os
import time
import json
import pandas as pd
import numpy as np
from datetime import datetime
import concurrent.futures

# ML Models
from sklearn.linear_model import LinearRegression, Ridge, Lasso, ElasticNet
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import (
    RandomForestRegressor,
    ExtraTreesRegressor,
    GradientBoostingRegressor,
    AdaBoostRegressor,
)
from sklearn.neighbors import KNeighborsRegressor
from sklearn.svm import SVR
try:
    from xgboost import XGBRegressor
    HAS_XGBOOST = True
except Exception:
    HAS_XGBOOST = False

try:
    from catboost import CatBoostRegressor
    HAS_CATBOOST = True
except Exception:
    HAS_CATBOOST = False

# Metrics and Selection
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
    mean_absolute_percentage_error,
)

FEATURE_COLUMNS = ["Open", "High", "Low", "Close", "Volume"]
TARGET_COLUMN = "Next_Day_Close"

AVAILABLE_MODELS = {
    "Linear Regression": LinearRegression,
    "Ridge Regression": Ridge,
    "Lasso Regression": lambda: Lasso(max_iter=5000),
    "Elastic Net Regression": lambda: ElasticNet(max_iter=5000),
    "Decision Tree Regressor": DecisionTreeRegressor,
    "Random Forest Regressor": lambda: RandomForestRegressor(n_estimators=50, random_state=42, n_jobs=-1),
    "Extra Trees Regressor": lambda: ExtraTreesRegressor(n_estimators=50, random_state=42, n_jobs=-1),
    "Gradient Boosting Regressor": lambda: GradientBoostingRegressor(n_estimators=50, random_state=42),
    "AdaBoost Regressor": lambda: AdaBoostRegressor(n_estimators=50, random_state=42),
    "KNeighbors Regressor": KNeighborsRegressor,
    "SVR": SVR,
}

if HAS_XGBOOST:
    AVAILABLE_MODELS["XGBoost Regressor"] = lambda: XGBRegressor(n_estimators=50, random_state=42, objective='reg:squarederror', n_jobs=-1)

if HAS_CATBOOST:
    AVAILABLE_MODELS["CatBoost Regressor"] = lambda: CatBoostRegressor(iterations=100, random_state=42, verbose=0, thread_count=-1)

class ModelService:
    def __init__(self):
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.project_root = os.path.abspath(os.path.join(self.base_dir, "..", "..", ".."))
        self.csv_path = self._find_csv_path()
        self.df = None
        self.X_train = None
        self.X_test = None
        self.y_train = None
        self.y_test = None
        self._load_and_prepare_dataset()

    def _find_csv_path(self) -> str:
        candidates = [
            os.path.join(self.project_root, "TCS_Historical_Data.csv"),
            os.path.join(self.base_dir, "..", "..", "TCS_Historical_Data.csv"),
            os.path.join(os.getcwd(), "TCS_Historical_Data.csv"),
            os.path.join(os.getcwd(), "backend", "TCS_Historical_Data.csv"),
        ]
        for candidate in candidates:
            if os.path.exists(candidate):
                return candidate
        return candidates[0]

    def _load_and_prepare_dataset(self):
        if os.path.exists(self.csv_path):
            df = pd.read_csv(self.csv_path)
            # Make sure date is sorted
            if "Date" in df.columns:
                df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
                df = df.sort_values("Date").reset_index(drop=True)
            
            # The Target is tomorrow's close price, if not present we create it
            if "Next_Day_Close" not in df.columns and "Close" in df.columns:
                df["Next_Day_Close"] = df["Close"].shift(-1)
            
            # Drop NaN rows due to shift
            df = df.dropna(subset=["Next_Day_Close"] + FEATURE_COLUMNS)
            self.df = df
            
            X = df[FEATURE_COLUMNS]
            y = df["Next_Day_Close"]
            
            # 80-20 split
            self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
        else:
            print(f"[ModelService] WARNING: CSV not found at {self.csv_path}")

    def get_available_models(self) -> list:
        return list(AVAILABLE_MODELS.keys())

    def get_metrics(self) -> dict:
        if self.X_train is None:
            raise RuntimeError("Dataset not loaded properly.")
            
        result = self.train_and_predict("Linear Regression", {
            "Open": 3950.0, "High": 3980.0, "Low": 3920.0, "Close": 3960.0, "Volume": 1500000
        })
        return {
            "default_model": "Linear Regression",
            "metrics": result["metrics"],
            "fit": result["fit"],
            "training_time": result["training_time"],
            "testing_time": result["testing_time"]
        }

    def _calculate_metrics(self, y_true, y_pred, n, p) -> dict:
        mae = mean_absolute_error(y_true, y_pred)
        mse = mean_squared_error(y_true, y_pred)
        rmse = np.sqrt(mse)
        rss = np.sum((y_true - y_pred) ** 2)
        mape = mean_absolute_percentage_error(y_true, y_pred)
        r2 = r2_score(y_true, y_pred)
        
        # Adjusted R2
        adj_r2 = 1 - (1 - r2) * (n - 1) / (n - p - 1) if (n - p - 1) > 0 else 0
        
        return {
            "MAE": round(mae, 4),
            "MSE": round(mse, 4),
            "RMSE": round(rmse, 4),
            "RSS": round(rss, 4),
            "MAPE": round(mape, 4),
            "R2": round(r2, 4),
            "Adjusted_R2": round(adj_r2, 4)
        }

    def _determine_fit(self, train_score: float, test_score: float) -> str:
        diff = train_score - test_score
        if diff > 0.10: # If training is much better than testing
            return "Overfitting"
        elif test_score < 0.60: # Arbitrary threshold for poor model performance overall
            return "Underfitting"
        else:
            return "Good Fit"

    def train_and_predict(self, model_name: str, input_features: dict) -> dict:
        if self.X_train is None:
            raise RuntimeError("Dataset not loaded properly.")
            
        if model_name not in AVAILABLE_MODELS:
            raise ValueError(f"Model '{model_name}' is not supported.")
            
        model_class_or_func = AVAILABLE_MODELS[model_name]
        if callable(model_class_or_func) and not isinstance(model_class_or_func, type):
            model = model_class_or_func()
        else:
            model = model_class_or_func()

        # Training
        t0 = time.time()
        model.fit(self.X_train, self.y_train)
        training_time = time.time() - t0

        # Testing & Metrics
        t1 = time.time()
        y_test_pred = model.predict(self.X_test)
        testing_time = time.time() - t1
        
        y_train_pred = model.predict(self.X_train)
        train_r2 = r2_score(self.y_train, y_train_pred)
        test_r2 = r2_score(self.y_test, y_test_pred)

        n = len(self.X_test)
        p = len(FEATURE_COLUMNS)
        metrics = self._calculate_metrics(self.y_test, y_test_pred, n, p)
        metrics["TrainScore"] = round(train_r2, 4)
        metrics["TestScore"] = round(test_r2, 4)

        fit_status = self._determine_fit(train_r2, test_r2)

        # Single Prediction
        feat_df = pd.DataFrame([input_features], columns=FEATURE_COLUMNS)
        single_pred = float(model.predict(feat_df)[0])

        # Feature Importance (if applicable)
        feature_importance = None
        if hasattr(model, 'feature_importances_'):
            feature_importance = model.feature_importances_.tolist()
        elif hasattr(model, 'coef_'):
            feature_importance = np.abs(model.coef_).tolist()
            
        # Correlation Matrix
        corr_matrix = self.df[FEATURE_COLUMNS + ["Next_Day_Close"]].corr().to_dict()

        # Limit points for performance on charts
        plot_limit = min(100, len(self.y_test))
        y_test_sample = self.y_test[:plot_limit].tolist()
        y_pred_sample = y_test_pred[:plot_limit].tolist()

        return {
            "prediction": round(single_pred, 2),
            "model": model_name,
            "metrics": metrics,
            "fit": fit_status,
            "training_time": round(training_time, 4),
            "testing_time": round(testing_time, 4),
            "timestamp": datetime.now().isoformat(),
            "chart_data": {
                "y_true": [round(x, 2) for x in y_test_sample],
                "y_pred": [round(x, 2) for x in y_pred_sample],
                "feature_importance": feature_importance,
                "feature_names": FEATURE_COLUMNS,
                "correlation_matrix": corr_matrix,
            }
        }
        
    def compare_models(self) -> list:
        if self.X_train is None:
            raise RuntimeError("Dataset not loaded properly.")
            
        n = len(self.X_test)
        p = len(FEATURE_COLUMNS)
        
        def evaluate_model(m_name):
            model_class_or_func = AVAILABLE_MODELS[m_name]
            if callable(model_class_or_func) and not isinstance(model_class_or_func, type):
                model = model_class_or_func()
            else:
                model = model_class_or_func()
                
            t0 = time.time()
            model.fit(self.X_train, self.y_train)
            train_time = time.time() - t0
            
            t1 = time.time()
            y_pred = model.predict(self.X_test)
            test_time = time.time() - t1
            
            metrics = self._calculate_metrics(self.y_test, y_pred, n, p)
            
            return {
                "Model_Name": m_name,
                "MAE": metrics["MAE"],
                "RMSE": metrics["RMSE"],
                "MAPE": metrics["MAPE"],
                "R2_Score": metrics["R2"],
                "Training_Time": round(train_time, 4),
                "Prediction_Time": round(test_time, 4)
            }
            
        leaderboard = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
            future_to_model = {executor.submit(evaluate_model, name): name for name in AVAILABLE_MODELS}
            for future in concurrent.futures.as_completed(future_to_model):
                try:
                    res = future.result()
                    leaderboard.append(res)
                except Exception as exc:
                    print(f"[ModelService] {future_to_model[future]} generated an exception: {exc}")
            
            
        # Sort by R2 descending
        leaderboard.sort(key=lambda x: x["R2_Score"], reverse=True)
        # Add rank
        for idx, item in enumerate(leaderboard):
            item["Rank"] = idx + 1
            
        return leaderboard

    def recommend_model(self, input_features: dict) -> dict:
        """
        Evaluates every available model using cross-validation and a weighted
        composite score, then returns the best model along with a human-readable
        explanation and full ranking details.
        """
        if self.X_train is None:
            raise RuntimeError("Dataset not loaded properly.")

        X_full = self.df[FEATURE_COLUMNS]
        y_full = self.df[TARGET_COLUMN]
        n = len(self.X_test)
        p = len(FEATURE_COLUMNS)

        def evaluate_single(m_name):
            try:
                model_class_or_func = AVAILABLE_MODELS[m_name]
                if callable(model_class_or_func) and not isinstance(model_class_or_func, type):
                    model = model_class_or_func()
                else:
                    model = model_class_or_func()

                # Cross-validation
                cv_scores = cross_val_score(model, X_full, y_full, cv=5, scoring="r2")
                cv_mean = float(np.mean(cv_scores))
                cv_std = float(np.std(cv_scores))

                # Train / test metrics
                t0 = time.time()
                model.fit(self.X_train, self.y_train)
                training_time = time.time() - t0

                y_train_pred = model.predict(self.X_train)
                y_test_pred = model.predict(self.X_test)

                train_r2 = float(r2_score(self.y_train, y_train_pred))
                test_r2 = float(r2_score(self.y_test, y_test_pred))
                rmse = float(np.sqrt(mean_squared_error(self.y_test, y_test_pred)))
                mae = float(mean_absolute_error(self.y_test, y_test_pred))
                mape = float(mean_absolute_percentage_error(self.y_test, y_test_pred))

                return {
                    "model": m_name,
                    "cv_mean": cv_mean,
                    "cv_std": cv_std,
                    "train_r2": train_r2,
                    "test_r2": test_r2,
                    "rmse": rmse,
                    "mae": mae,
                    "mape": mape,
                    "training_time": round(training_time, 4),
                }
            except Exception as exc:
                print(f"[recommend_model] Skipping '{m_name}': {exc}")
                return None

        # Run all evaluations in parallel
        results = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=6) as executor:
            future_to_name = {
                executor.submit(evaluate_single, name): name
                for name in AVAILABLE_MODELS
            }
            for future in concurrent.futures.as_completed(future_to_name):
                res = future.result()
                if res is not None:
                    results.append(res)

        if not results:
            raise RuntimeError("All models failed during recommendation evaluation.")

        # Normalization helpers
        max_rmse = max(r["rmse"] for r in results) or 1.0
        max_mae = max(r["mae"] for r in results) or 1.0

        # Compute composite score for every model
        for r in results:
            normalized_rmse = r["rmse"] / max_rmse
            normalized_mae = r["mae"] / max_mae
            generalization_score = max(0.0, 1.0 - abs(r["train_r2"] - r["test_r2"]))
            r["composite_score"] = (
                (r["cv_mean"] * 0.40)
                + (r["test_r2"] * 0.25)
                + ((1 - normalized_rmse) * 0.20)
                + ((1 - normalized_mae) * 0.10)
                + (generalization_score * 0.05)
            )
            r["generalization_score"] = generalization_score

        # Sort descending by composite score
        results.sort(key=lambda x: x["composite_score"], reverse=True)
        best = results[0]

        # Build human-readable reason
        reason_parts = []

        # Highest CV score?
        if best["cv_mean"] == max(r["cv_mean"] for r in results):
            reason_parts.append(
                f"Highest Cross-Validation Score ({round(best['cv_mean'], 4)})"
            )

        # Lowest RMSE?
        if best["rmse"] == min(r["rmse"] for r in results):
            reason_parts.append(f"Lowest RMSE ({round(best['rmse'], 2)})")

        # Lowest MAE?
        if best["mae"] == min(r["mae"] for r in results):
            reason_parts.append(f"Lowest MAE ({round(best['mae'], 2)})")

        # Best generalization gap?
        best_gen = max(r["generalization_score"] for r in results)
        if best["generalization_score"] == best_gen:
            reason_parts.append(
                f"Best generalization gap ({round(abs(best['train_r2'] - best['test_r2']), 4)})"
            )

        # Highest test R²?
        if best["test_r2"] == max(r["test_r2"] for r in results):
            reason_parts.append(f"Highest Test R² ({round(best['test_r2'], 4)})")

        if not reason_parts:
            reason_parts.append(
                f"Best overall composite score ({round(best['composite_score'], 4)})"
            )

        reason = ", ".join(reason_parts)

        all_scores = [
            {
                "model": r["model"],
                "cv_mean": round(r["cv_mean"], 4),
                "cv_std": round(r["cv_std"], 4),
                "composite_score": round(r["composite_score"], 4),
                "rmse": round(r["rmse"], 4),
                "mae": round(r["mae"], 4),
                "test_r2": round(r["test_r2"], 4),
            }
            for r in results
        ]

        return {
            "recommended_model": best["model"],
            "reason": reason,
            "expected_accuracy": round(best["test_r2"] * 100, 2),
            "confidence_score": round(best["cv_mean"] * 100, 2),
            "cv_score": round(best["cv_mean"], 4),
            "cv_std": round(best["cv_std"], 4),
            "all_scores": all_scores,
        }

    # Retaining dataset info endpoints for existing routers
    def get_dataset_info(self) -> dict:
        if self.df is None or self.df.empty:
            return {"Total_Rows": 0, "Total_Columns": 0, "Columns": [], "Missing_Values": {}, "Date_Range": {"Min": None, "Max": None}, "Stats_Summary": {}}

        numeric_cols = FEATURE_COLUMNS + ["Next_Day_Close"]
        stats_summary = {}
        for col in numeric_cols:
            if col in self.df.columns:
                stats_summary[col] = {
                    "mean": round(float(self.df[col].mean()), 2),
                    "std": round(float(self.df[col].std()), 2),
                    "min": round(float(self.df[col].min()), 2),
                    "max": round(float(self.df[col].max()), 2),
                    "median": round(float(self.df[col].median()), 2),
                }

        missing_vals = {col: int(self.df[col].isnull().sum()) for col in self.df.columns}

        min_date = self.df["Date"].min().strftime("%Y-%m-%d") if "Date" in self.df.columns and not self.df["Date"].isnull().all() else None
        max_date = self.df["Date"].max().strftime("%Y-%m-%d") if "Date" in self.df.columns and not self.df["Date"].isnull().all() else None

        return {
            "Total_Rows": len(self.df),
            "Total_Columns": len(self.df.columns),
            "Columns": list(self.df.columns),
            "Missing_Values": missing_vals,
            "Date_Range": {"Min": min_date, "Max": max_date},
            "Stats_Summary": stats_summary,
        }

    def get_dataset_records(self, limit: int = 500, skip: int = 0) -> list:
        if self.df is None or self.df.empty:
            return []

        sliced = self.df.iloc[skip: skip + limit].copy()
        if "Date" in sliced.columns:
            sliced["Date"] = sliced["Date"].dt.strftime("%Y-%m-%d")

        clean = []
        for row in sliced.to_dict(orient="records"):
            clean.append({
                "Date": str(row.get("Date", "")),
                "Open": round(float(row.get("Open", 0)), 2),
                "High": round(float(row.get("High", 0)), 2),
                "Low": round(float(row.get("Low", 0)), 2),
                "Close": round(float(row.get("Close", 0)), 2),
                "Volume": int(row.get("Volume", 0)),
                "Next_Day_Close": round(float(row.get("Next_Day_Close", 0)), 2),
            })
        return clean

model_service = ModelService()
