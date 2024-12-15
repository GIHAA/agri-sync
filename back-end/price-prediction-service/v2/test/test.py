import pickle
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.neighbors import KNeighborsRegressor
import matplotlib.pyplot as plt

# Load the data
df = pd.read_csv("Price_Prediction.csv")

# Data preprocessing
df = df.dropna()

# Encode categorical variables
label_encoders = {}
categorical_columns = ['item', 'district', 'month']
for col in categorical_columns:
    label_encoders[col] = LabelEncoder()
    df[col] = label_encoders[col].fit_transform(df[col])

# Prepare features and target
feature_columns = ['year', 'item', 'district', 'month', 'temperature', 'rain', 
                  'LP95', 'LP92', 'LAD', 'LSD', 'LK', 'LIK']
X = df[feature_columns]
y = df['price']

# Scale the features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
X_scaled = pd.DataFrame(X_scaled, columns=X.columns)

# Split data
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Define models with improved parameters
models = {
    "Linear Regression": LinearRegression(),
    "Random Forest": RandomForestRegressor(
        n_estimators=200,
        max_depth=15,
        min_samples_split=5,
        random_state=42
    ),
    "K-Nearest Neighbors": KNeighborsRegressor(
        n_neighbors=5,
        weights='distance'
    ),
    "Gradient Boosting": GradientBoostingRegressor(
        n_estimators=200,
        learning_rate=0.1,
        max_depth=5,
        random_state=42
    )
}

# Improved hyperparameter tuning for Random Forest
param_grid_rf = {
    'n_estimators': [100, 200, 300],
    'max_depth': [10, 15, 20],
    'min_samples_split': [2, 5],
    'min_samples_leaf': [1, 2, 4]
}

grid_search_rf = GridSearchCV(RandomForestRegressor(random_state=42), 
                            param_grid_rf, 
                            cv=5, 
                            scoring='neg_mean_squared_error',  # Changed scoring metric
                            n_jobs=-1)
grid_search_rf.fit(X_train, y_train)
models["Random Forest"] = grid_search_rf.best_estimator_

# Updated evaluation function
def evaluate_model(model, X_train, X_test, y_train, y_test):
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    cv_scores = cross_val_score(model, X_scaled, y, cv=5, scoring='neg_mean_squared_error')
    return {
        'MSE': mean_squared_error(y_test, y_pred),
        'R2': r2_score(y_test, y_pred),
        'MAE': mean_absolute_error(y_test, y_pred),
        'Cross_Val_Score': -np.mean(cv_scores)  # Convert back to MSE
    }

# Train and evaluate models
results = {}
for model_name, model in models.items():
    print(f"Evaluating {model_name}...")
    results[model_name] = evaluate_model(model, X_train, X_test, y_train, y_test)

# Convert results to DataFrame
results_df = pd.DataFrame(results).T
print("\nModel Comparison:")
print(results_df)

# Plotting functions
def plot_model_metrics(results_df, metric):
    plt.figure(figsize=(10, 6))
    results_df[metric].plot(kind='bar', color='skyblue')
    plt.title(f'Model Comparison by {metric}')
    plt.ylabel(metric)
    plt.xlabel('Model')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()

def plot_feature_importance(model, feature_names):
    if hasattr(model, 'feature_importances_'):
        importances = model.feature_importances_
        indices = np.argsort(importances)[::-1]
        
        plt.figure(figsize=(12, 6))
        plt.title('Feature Importances')
        plt.bar(range(len(feature_names)), importances[indices])
        plt.xticks(range(len(feature_names)), [feature_names[i] for i in indices], rotation=45)
        plt.tight_layout()
        plt.show()

def plot_predictions(model, X_test, y_test, title):
    y_pred = model.predict(X_test)
    plt.figure(figsize=(10, 6))
    plt.scatter(y_test, y_pred, alpha=0.5)
    plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
    plt.xlabel('Actual Prices')
    plt.ylabel('Predicted Prices')
    plt.title(title)
    plt.tight_layout()
    plt.show()

# Generate plots
plot_model_metrics(results_df, 'R2')
plot_model_metrics(results_df, 'MSE')

# Find and save best model
best_model_name = results_df['R2'].idxmax()
best_model = models[best_model_name]

# Plot feature importance for best model
plot_feature_importance(best_model, feature_columns)

# Plot predictions for best model
plot_predictions(best_model, X_test, y_test, f'{best_model_name} Predictions')

# Save the best model
model_filename = 'best_price_prediction_model.pkl'
with open(model_filename, 'wb') as f:
    pickle.dump({
        'model': best_model,
        'label_encoders': label_encoders,
        'feature_columns': feature_columns
    }, f)

print(f"\nBest Model: {best_model_name}")
print(f"R² Score: {results_df.loc[best_model_name, 'R2']:.4f}")
print(f"MSE: {results_df.loc[best_model_name, 'MSE']:.4f}")
print(f"MAE: {results_df.loc[best_model_name, 'MAE']:.4f}")
print(f"Cross-Validation Score: {results_df.loc[best_model_name, 'Cross_Val_Score']:.4f}")