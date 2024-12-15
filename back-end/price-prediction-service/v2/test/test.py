import pickle
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.preprocessing import LabelEncoder, StandardScaler, RobustScaler
from sklearn.linear_model import LinearRegression, HuberRegressor
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
import matplotlib.pyplot as plt

# Load and preprocess data
df = pd.read_csv("Price_Prediction.csv")
df = df.dropna()

# Add feature engineering
df['price_per_temp'] = df['price'] / (df['temperature'] + 1)  # Add 1 to avoid division by zero
df['fuel_price_ratio'] = df['LP95'] / df['LP92']

# Encode categorical variables
label_encoders = {}
categorical_columns = ['item', 'district', 'month']
for col in categorical_columns:
    label_encoders[col] = LabelEncoder()
    df[col] = label_encoders[col].fit_transform(df[col])

# Prepare features with new engineered features
feature_columns = ['year', 'item', 'district', 'month', 'temperature', 'rain', 
                  'LP95', 'LP92', 'LAD', 'LSD', 'LK', 'LIK',
                  'price_per_temp', 'fuel_price_ratio']

X = df[feature_columns]
y = df['price']

# Use RobustScaler instead of StandardScaler to handle outliers better
scaler = RobustScaler()
X_scaled = scaler.fit_transform(X)
X_scaled = pd.DataFrame(X_scaled, columns=X.columns)

# Split data
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Define improved models
models = {
    "Huber Regression": HuberRegressor(epsilon=1.35, max_iter=200),
    "Random Forest": RandomForestRegressor(
        n_estimators=300,
        max_depth=20,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    ),
    "Gradient Boosting": GradientBoostingRegressor(
        n_estimators=300,
        learning_rate=0.05,
        max_depth=6,
        min_samples_split=5,
        min_samples_leaf=2,
        subsample=0.8,
        random_state=42
    )
}

# Improved hyperparameter tuning for Gradient Boosting
param_grid_gb = {
    'n_estimators': [200, 300, 400],
    'learning_rate': [0.01, 0.05, 0.1],
    'max_depth': [4, 6, 8],
    'subsample': [0.8, 0.9, 1.0]
}

grid_search_gb = GridSearchCV(GradientBoostingRegressor(random_state=42),
                            param_grid_gb,
                            cv=5,
                            scoring='neg_mean_squared_error',
                            n_jobs=-1)
grid_search_gb.fit(X_train, y_train)
models["Gradient Boosting"] = grid_search_gb.best_estimator_

def evaluate_model(model, X_train, X_test, y_train, y_test):
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    cv_scores = cross_val_score(model, X_scaled, y, cv=5, scoring='neg_mean_squared_error')
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    return {
        'RMSE': rmse,
        'R2': r2_score(y_test, y_pred),
        'MAE': mean_absolute_error(y_test, y_pred),
        'Cross_Val_RMSE': np.sqrt(-np.mean(cv_scores))
    }

# Train and evaluate models
results = {}
for model_name, model in models.items():
    print(f"Evaluating {model_name}...")
    results[model_name] = evaluate_model(model, X_train, X_test, y_train, y_test)

# Convert results to DataFrame and display
results_df = pd.DataFrame(results).T
print("\nModel Comparison:")
print(results_df)

# Find and save best model
best_model_name = results_df['R2'].idxmax()
best_model = models[best_model_name]

# Save the final model and preprocessing objects
model_artifacts = {
    'model': best_model,
    'scaler': scaler,
    'label_encoders': label_encoders,
    'feature_columns': feature_columns
}

with open('price_prediction_model.pkl', 'wb') as f:
    pickle.dump(model_artifacts, f)

print(f"\nBest Model: {best_model_name}")
print(f"R² Score: {results_df.loc[best_model_name, 'R2']:.4f}")
print(f"RMSE: {results_df.loc[best_model_name, 'RMSE']:.4f}")
print(f"MAE: {results_df.loc[best_model_name, 'MAE']:.4f}")
print(f"Cross-Validation RMSE: {results_df.loc[best_model_name, 'Cross_Val_RMSE']:.4f}")

# Feature importance plot for tree-based models
if hasattr(best_model, 'feature_importances_'):
    importances = best_model.feature_importances_
    indices = np.argsort(importances)[::-1]
    
    plt.figure(figsize=(12, 6))
    plt.title(f'Feature Importances ({best_model_name})')
    plt.bar(range(len(feature_columns)), importances[indices])
    plt.xticks(range(len(feature_columns)), [feature_columns[i] for i in indices], rotation=45)
    plt.tight_layout()
    plt.show()