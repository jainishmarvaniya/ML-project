import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score

def main():
    print("Training Random Forest Regression...")
    # Load data
    df = pd.read_csv("TCS_Historical_Data.csv", sep=",")
    
    # Create target variable (Next Day Close)
    df["Next_Day_Close"] = df["Close"].shift(-1)
    
    # Drop rows with NaN values
    df = df.dropna()
    
    # Features and Target
    X = df[["Open", "High", "Low", "Close", "Volume"]]
    y = df["Next_Day_Close"]
    
    # Train-test split (chronological order)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)
    
    # Initialize and train model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Predictions
    y_train_pred = model.predict(X_train)
    y_test_pred = model.predict(X_test)
    
    # Evaluation
    train_r2 = r2_score(y_train, y_train_pred)
    test_r2 = r2_score(y_test, y_test_pred)
    train_mse = mean_squared_error(y_train, y_train_pred)
    test_mse = mean_squared_error(y_test, y_test_pred)
    
    print(f"Train R2 Score: {train_r2:.4f}, Train MSE: {train_mse:.4f}")
    print(f"Test R2 Score: {test_r2:.4f}, Test MSE: {test_mse:.4f}")
    
    if train_r2 > 0.95 and test_r2 < 0.8:
        print("Model Status: Overfitting (High train score, low test score)")
    elif train_r2 < 0.7 and test_r2 < 0.7:
        print("Model Status: Underfitting (Low scores on both train and test)")
    else:
        print("Model Status: Good Fit / Acceptable")
        
    # Save the model
    joblib.dump(model, "random_forest.pkl")
    print("Model saved to random_forest.pkl\n")

if __name__ == "__main__":
    main()
