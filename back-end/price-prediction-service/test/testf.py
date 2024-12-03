import pickle
import pandas as pd
import numpy as np
from sklearn.metrics import (mean_squared_error, r2_score, 
                           mean_absolute_error, precision_score, recall_score)
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.neighbors import KNeighborsRegressor
from sklearn.preprocessing import LabelEncoder
import seaborn as sns

# Load and prepare data (keeping your existing data preparation code)
df = pd.read_excel("data.xlsx", sheet_name="Sheet2", skiprows=2)
df.columns = ['Index', 'Year', 'Vegetable', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
df = df.drop(columns=['Index'])
df = df[df['Year'] != 'Year']

# Ensure the data types are correct
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
for month in months:
    df[month] = pd.to_numeric(df[month], errors='coerce')
df['Year'] = pd.to_numeric(df['Year'], errors='coerce', downcast='integer')

# Reshape the data to long format
df_long = df.melt(id_vars=['Year', 'Vegetable'], value_vars=months, 
                  var_name='Month', value_name='Price')
df_long = df_long.dropna(subset=['Price'])

# Encode categorical data
label_encoder_veg = LabelEncoder()
df_long['Vegetable'] = label_encoder_veg.fit_transform(df_long['Vegetable'])

# Prepare feature matrix and target vector
X = df_long[['Year', 'Vegetable', 'Month']]
y = df_long['Price']

# One-hot encoding for 'Month'
X = pd.get_dummies(X, columns=['Month'], drop_first=True)

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Define models
models = {
    "Random Forest": RandomForestRegressor(random_state=42),
    "K-Nearest Neighbors": KNeighborsRegressor(),
    "Gradient Boosting": GradientBoostingRegressor(random_state=42)
}

def calculate_mape(y_true, y_pred):
    """Calculate Mean Absolute Percentage Error"""
    return np.mean(np.abs((y_true - y_pred) / y_true)) * 100

def evaluate_model(y_true, y_pred):
    """Calculate multiple evaluation metrics"""
    mse = mean_squared_error(y_true, y_pred)
    rmse = np.sqrt(mse)
    mae = mean_absolute_error(y_true, y_pred)
    r2 = r2_score(y_true, y_pred)
    mape = calculate_mape(y_true, y_pred)
    
    return {
        'MSE': mse,
        'RMSE': rmse,
        'MAE': mae,
        'R2': r2,
        'MAPE': mape
    }

# Train and evaluate each model
results = {}
predictions = {}

for model_name, model in models.items():
    # Train the model
    model.fit(X_train, y_train)
    
    # Make predictions
    y_pred = model.predict(X_test)
    predictions[model_name] = y_pred
    
    # Calculate metrics
    results[model_name] = evaluate_model(y_test, y_pred)

# Convert results to DataFrame
results_df = pd.DataFrame(results).T

# Create visualization functions
def plot_metric_comparison(results_df, metric, title):
    plt.figure(figsize=(10, 6))
    sns.barplot(x=results_df.index, y=results_df[metric], palette='viridis')
    plt.title(f'Model Comparison: {title}')
    plt.xlabel('Models')
    plt.ylabel(metric)
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()

# Plot individual metrics
metrics_to_plot = {
    'R2': 'R² Score (higher is better)',
    'MSE': 'Mean Squared Error (lower is better)',
    'RMSE': 'Root Mean Squared Error (lower is better)',
    'MAE': 'Mean Absolute Error (lower is better)',
    'MAPE': 'Mean Absolute Percentage Error (lower is better)'
}

for metric, title in metrics_to_plot.items():
    plot_metric_comparison(results_df, metric, title)

# Create a heatmap of all metrics
plt.figure(figsize=(12, 8))
sns.heatmap(results_df, annot=True, cmap='YlOrRd', fmt='.3f')
plt.title('Model Performance Metrics Heatmap')
plt.tight_layout()
plt.show()

# Determine best model based on multiple criteria
best_model_r2 = results_df['R2'].idxmax()
best_model_mse = results_df['MSE'].idxmin()
best_model_mae = results_df['MAE'].idxmin()
best_model_mape = results_df['MAPE'].idxmin()

print("\nBest Models by Different Metrics:")
print(f"Best by R²: {best_model_r2} (R² = {results_df.loc[best_model_r2, 'R2']:.4f})")
print(f"Best by MSE: {best_model_mse} (MSE = {results_df.loc[best_model_mse, 'MSE']:.4f})")
print(f"Best by MAE: {best_model_mae} (MAE = {results_df.loc[best_model_mae, 'MAE']:.4f})")
print(f"Best by MAPE: {best_model_mape} (MAPE = {results_df.loc[best_model_mape, 'MAPE']:.4f}%)")

# Save the overall best model (using R² as the primary metric)
best_model = models[best_model_r2]
with open('best_model.pkl', 'wb') as f:
    pickle.dump(best_model, f)

# Create residual plots for each model
plt.figure(figsize=(15, 10))
for idx, (model_name, y_pred) in enumerate(predictions.items(), 1):
    plt.subplot(2, 2, idx)
    plt.scatter(y_pred, y_test - y_pred, alpha=0.5)
    plt.xlabel('Predicted Values')
    plt.ylabel('Residuals')
    plt.title(f'Residual Plot: {model_name}')
    plt.axhline(y=0, color='r', linestyle='--')
plt.tight_layout()
plt.show()

# Print detailed results
print("\nDetailed Model Performance Metrics:")
print(results_df.round(4).to_string())