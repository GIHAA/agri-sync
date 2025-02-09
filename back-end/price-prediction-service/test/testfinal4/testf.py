import pickle
import pandas as pd
import numpy as np
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.model_selection import train_test_split, GridSearchCV
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import LabelEncoder
import seaborn as sns
import os

# Create output directory for plots
os.makedirs('vegetable_plots', exist_ok=True)

# Load and prepare data
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

# Get unique vegetables
vegetables = df['Vegetable'].unique()

# Function to evaluate model
def evaluate_model(y_true, y_pred):
    """Calculate multiple evaluation metrics"""
    mse = mean_squared_error(y_true, y_pred)
    rmse = np.sqrt(mse)
    mae = mean_absolute_error(y_true, y_pred)
    r2 = r2_score(y_true, y_pred)
    mape = np.mean(np.abs((y_true - y_pred) / y_true)) * 100
    
    return {
        'MSE': mse,
        'RMSE': rmse,
        'MAE': mae,
        'R2': r2,
        'MAPE': mape
    }

# Dictionary to store results for all vegetables
all_results = {}

# Process each vegetable separately
for vegetable in vegetables:
    print(f"\nProcessing {vegetable}...")
    
    # Filter data for current vegetable
    df_veg = df[df['Vegetable'] == vegetable]
    
    # Reshape to long format
    df_long = df_veg.melt(id_vars=['Year', 'Vegetable'], value_vars=months, 
                         var_name='Month', value_name='Price')
    df_long = df_long.dropna(subset=['Price'])
    
    # Prepare feature matrix
    X = df_long[['Year', 'Month']]
    y = df_long['Price']
    
    # One-hot encoding for 'Month'
    X = pd.get_dummies(X, columns=['Month'], drop_first=True)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Define and train models
    rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
    gb_model = GradientBoostingRegressor(n_estimators=100, random_state=42)
    
    rf_model.fit(X_train, y_train)
    gb_model.fit(X_train, y_train)
    
    # Make predictions
    rf_y_pred = rf_model.predict(X_test)
    gb_y_pred = gb_model.predict(X_test)
    
    # Calculate metrics
    rf_metrics = evaluate_model(y_test, rf_y_pred)
    gb_metrics = evaluate_model(y_test, gb_y_pred)
    
    # Store results
    all_results[vegetable] = {
        'rf_metrics': rf_metrics,
        'gb_metrics': gb_metrics,
        'test_data': (y_test, rf_y_pred, gb_y_pred)
    }
    
    # Create metrics comparison plot for this vegetable
    plt.figure(figsize=(15, 10))
    metrics = ['R2', 'MSE', 'RMSE', 'MAE', 'MAPE']
    results_df = pd.DataFrame({
        'Model': ['Random Forest', 'Gradient Boosting'],
        'R2': [rf_metrics['R2'], gb_metrics['R2']],
        'MSE': [rf_metrics['MSE'], gb_metrics['MSE']],
        'RMSE': [rf_metrics['RMSE'], gb_metrics['RMSE']],
        'MAE': [rf_metrics['MAE'], gb_metrics['MAE']],
        'MAPE': [rf_metrics['MAPE'], gb_metrics['MAPE']]
    })
    
    for idx, metric in enumerate(metrics, 1):
        plt.subplot(2, 3, idx)
        sns.barplot(x='Model', y=metric, data=results_df)
        plt.title(f'{metric} Comparison - {vegetable}')
        plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig(f'vegetable_plots/{vegetable}_metrics_comparison.png')
    plt.close()
    
    # Create prediction vs actual plots for this vegetable
    plt.figure(figsize=(15, 6))
    
    plt.subplot(1, 2, 1)
    plt.scatter(y_test, rf_y_pred, alpha=0.5)
    plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
    plt.xlabel('Actual Values')
    plt.ylabel('Predicted Values')
    plt.title(f'Random Forest: Actual vs Predicted - {vegetable}')
    
    plt.subplot(1, 2, 2)
    plt.scatter(y_test, gb_y_pred, alpha=0.5)
    plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
    plt.xlabel('Actual Values')
    plt.ylabel('Predicted Values')
    plt.title(f'Gradient Boosting: Actual vs Predicted - {vegetable}')
    
    plt.tight_layout()
    plt.savefig(f'vegetable_plots/{vegetable}_prediction_vs_actual.png')
    plt.close()

# Create summary of best models for each vegetable
summary_data = []
for vegetable in vegetables:
    rf_r2 = all_results[vegetable]['rf_metrics']['R2']
    gb_r2 = all_results[vegetable]['gb_metrics']['R2']
    best_model = 'Random Forest' if rf_r2 > gb_r2 else 'Gradient Boosting'
    best_r2 = max(rf_r2, gb_r2)
    
    summary_data.append({
        'Vegetable': vegetable,
        'Best Model': best_model,
        'R2 Score': best_r2,
        'RMSE': min(all_results[vegetable]['rf_metrics']['RMSE'],
                   all_results[vegetable]['gb_metrics']['RMSE'])
    })

summary_df = pd.DataFrame(summary_data)
print("\nModel Performance Summary by Vegetable:")
print(summary_df.round(4).to_string(index=False))