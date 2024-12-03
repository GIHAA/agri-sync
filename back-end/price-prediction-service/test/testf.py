import pickle
import pandas as pd
import numpy as np
from sklearn.metrics import (mean_squared_error, r2_score, 
                           mean_absolute_error, precision_score, recall_score)
from sklearn.model_selection import train_test_split, GridSearchCV
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
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

# Define hyperparameter grids for each model
random_forest_params = {
    'n_estimators': [50, 100, 200],
    'max_depth': [None, 10, 20, 30],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4]
}

gradient_boosting_params = {
    'n_estimators': [50, 100, 200],
    'learning_rate': [0.01, 0.1, 0.2],
    'max_depth': [3, 5, 10],
    'subsample': [0.8, 0.9, 1.0]
}

# Perform Grid Search for Random Forest
rf_grid_search = GridSearchCV(
    estimator=RandomForestRegressor(random_state=42),
    param_grid=random_forest_params,
    scoring='neg_mean_squared_error',
    cv=5,
    verbose=2,
    n_jobs=-1
)

rf_grid_search.fit(X_train, y_train)

# Perform Grid Search for Gradient Boosting
gb_grid_search = GridSearchCV(
    estimator=GradientBoostingRegressor(random_state=42),
    param_grid=gradient_boosting_params,
    scoring='neg_mean_squared_error',
    cv=5,
    verbose=2,
    n_jobs=-1
)

gb_grid_search.fit(X_train, y_train)

# Evaluate the best models
rf_best_model = rf_grid_search.best_estimator_
gb_best_model = gb_grid_search.best_estimator_

print("\nBest Random Forest Parameters:")
print(rf_grid_search.best_params_)

print("\nBest Gradient Boosting Parameters:")
print(gb_grid_search.best_params_)

# Make predictions
rf_y_pred = rf_best_model.predict(X_test)
gb_y_pred = gb_best_model.predict(X_test)

# Enhanced evaluation metrics calculation
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

# Calculate metrics
rf_metrics = evaluate_model(y_test, rf_y_pred)
gb_metrics = evaluate_model(y_test, gb_y_pred)

# Create DataFrame for results
tuned_results_df = pd.DataFrame({
    'Model': ['Random Forest (Tuned)', 'Gradient Boosting (Tuned)'],
    'R2': [rf_metrics['R2'], gb_metrics['R2']],
    'MSE': [rf_metrics['MSE'], gb_metrics['MSE']],
    'RMSE': [rf_metrics['RMSE'], gb_metrics['RMSE']],
    'MAE': [rf_metrics['MAE'], gb_metrics['MAE']],
    'MAPE': [rf_metrics['MAPE'], gb_metrics['MAPE']]
})

# Set up the matplotlib style
plt.style.use('classic')  # Using a built-in style
plt.rcParams['figure.facecolor'] = 'white'
plt.rcParams['axes.facecolor'] = 'white'
plt.rcParams['axes.grid'] = True
plt.rcParams['grid.alpha'] = 0.3
# Use colorblind-friendly colors
colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd']
sns.set_palette(colors)

# 1. Create a comprehensive metrics comparison plot
plt.figure(figsize=(15, 10))
metrics = ['R2', 'MSE', 'RMSE', 'MAE', 'MAPE']
for idx, metric in enumerate(metrics, 1):
    plt.subplot(2, 3, idx)
    sns.barplot(x='Model', y=metric, data=tuned_results_df)
    plt.title(f'{metric} Comparison')
    plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig('metrics_comparison.png')
plt.close()

# 2. Create prediction vs actual scatter plots
plt.figure(figsize=(15, 6))
plt.subplot(1, 2, 1)
plt.scatter(y_test, rf_y_pred, alpha=0.5)
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
plt.xlabel('Actual Values')
plt.ylabel('Predicted Values')
plt.title('Random Forest: Actual vs Predicted')

plt.subplot(1, 2, 2)
plt.scatter(y_test, gb_y_pred, alpha=0.5)
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
plt.xlabel('Actual Values')
plt.ylabel('Predicted Values')
plt.title('Gradient Boosting: Actual vs Predicted')
plt.tight_layout()
plt.savefig('prediction_vs_actual.png')
plt.close()

# 3. Create residual plots with distribution
def plot_residuals_with_dist(y_true, y_pred, title):
    residuals = y_true - y_pred
    
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8), gridspec_kw={'height_ratios': [3, 1]})
    
    # Scatter plot of residuals
    ax1.scatter(y_pred, residuals, alpha=0.5)
    ax1.axhline(y=0, color='r', linestyle='--')
    ax1.set_xlabel('Predicted Values')
    ax1.set_ylabel('Residuals')
    ax1.set_title(f'Residual Plot: {title}')
    
    # Distribution of residuals
    sns.histplot(residuals, kde=True, ax=ax2)
    ax2.set_xlabel('Residual Value')
    ax2.set_ylabel('Count')
    
    plt.tight_layout()
    return fig

# Create and save residual plots
rf_residual_fig = plot_residuals_with_dist(y_test, rf_y_pred, 'Random Forest')
rf_residual_fig.savefig('rf_residuals.png')
plt.close(rf_residual_fig)

gb_residual_fig = plot_residuals_with_dist(y_test, gb_y_pred, 'Gradient Boosting')
gb_residual_fig.savefig('gb_residuals.png')
plt.close(gb_residual_fig)

# 4. Feature importance comparison
def plot_feature_importance(rf_model, gb_model, X):
    feature_names = X.columns
    
    # Get feature importance scores
    rf_importance = pd.DataFrame({
        'feature': feature_names,
        'importance': rf_model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    gb_importance = pd.DataFrame({
        'feature': feature_names,
        'importance': gb_model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    # Plot feature importance
    plt.figure(figsize=(15, 6))
    
    plt.subplot(1, 2, 1)
    sns.barplot(x='importance', y='feature', data=rf_importance.head(10))
    plt.title('Random Forest Feature Importance')
    
    plt.subplot(1, 2, 2)
    sns.barplot(x='importance', y='feature', data=gb_importance.head(10))
    plt.title('Gradient Boosting Feature Importance')
    
    plt.tight_layout()
    plt.savefig('feature_importance.png')
    plt.close()

# Plot feature importance
plot_feature_importance(rf_best_model, gb_best_model, X)

# 5. Create a correlation matrix of features
plt.figure(figsize=(12, 8))
correlation_matrix = X.corr()
sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0)
plt.title('Feature Correlation Matrix')
plt.tight_layout()
plt.savefig('correlation_matrix.png')
plt.close()

# Print detailed results
print("\nDetailed Model Performance Metrics:")
print(tuned_results_df.round(4).to_string())

# Save the overall best model
best_model = rf_best_model if rf_metrics['R2'] > gb_metrics['R2'] else gb_best_model
with open('best_model.pkl', 'wb') as f:
    pickle.dump(best_model, f)

# Create a performance summary
performance_summary = pd.DataFrame({
    'Metric': ['Best Model', 'Best R2 Score', 'Best RMSE', 'Best MAE', 'Best MAPE'],
    'Value': [
        'Random Forest' if rf_metrics['R2'] > gb_metrics['R2'] else 'Gradient Boosting',
        max(rf_metrics['R2'], gb_metrics['R2']),
        min(rf_metrics['RMSE'], gb_metrics['RMSE']),
        min(rf_metrics['MAE'], gb_metrics['MAE']),
        min(rf_metrics['MAPE'], gb_metrics['MAPE'])
    ]
})

print("\nPerformance Summary:")
print(performance_summary.to_string(index=False))