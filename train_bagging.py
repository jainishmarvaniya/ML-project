# %% [markdown]
# # Model Training

# %%
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import BaggingRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_squared_error, r2_score

print("Training Bagging Regression (since previous models were overfitting)...")
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

# Initialize base estimator (DecisionTreeRegressor)
# Added max_depth to prevent the base estimator from overfitting
base_estimator = DecisionTreeRegressor(max_depth=5, random_state=42)

# Initialize and train Bagging model
# Note: Using estimator=base_estimator (scikit-learn >= 1.2) or base_estimator=base_estimator
try:
    model = BaggingRegressor(estimator=base_estimator, n_estimators=50, random_state=42)
    model.fit(X_train, y_train)
except TypeError:
    # Fallback for older scikit-learn versions
    model = BaggingRegressor(base_estimator=base_estimator, n_estimators=50, random_state=42)
    model.fit(X_train, y_train)

# Predictions
y_train_pred = model.predict(X_train)
y_test_pred = model.predict(X_test)

# %% [markdown]
# ### Evaluation & Overfitting/Underfitting Check
# %%
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
joblib.dump(model, "bagging_model.pkl")
print("Model saved to bagging_model.pkl\n")

