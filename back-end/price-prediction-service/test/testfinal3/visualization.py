# visualization.py
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import numpy as np
import pandas as pd

def plot_model_comparison(results):
    """Create visualizations comparing model performance"""
    fig, axes = plt.subplots(2, 2, figsize=(15, 12))
    fig.suptitle('Model Performance Comparison', fontsize=16, y=1.02)
    
    metrics = {
        (0,0): ('R2', 'R² Score by Model'),
        (0,1): ('RMSE', 'RMSE by Model'),
        (1,0): ('MAE', 'MAE by Model'),
        (1,1): ('Cross_Val_Score', 'Cross-validation Score by Model')
    }
    
    for (i,j), (metric, title) in metrics.items():
        sns.barplot(x='Model', y=metric, data=results, ax=axes[i,j])
        axes[i,j].set_title(title)
        axes[i,j].set_xticklabels(axes[i,j].get_xticklabels(), rotation=45)
    
    plt.tight_layout()
    plt.savefig('model_comparison.png')
    plt.close()
    
    return fig

def plot_model_vegetable_comparison(X_test, y_test, models_dict, X_train_scaled, X_test_scaled, 
                                  y_train, original_df):
    """Create comparison plots for each vegetable"""
    if isinstance(X_test, np.ndarray):
        X_test = pd.DataFrame(X_test, columns=X.columns)
    
    unique_vegetables = original_df['Vegetable'].unique()
    print(f"Found vegetables: {unique_vegetables}")
    
    veg_columns = [f'Vegetable_{veg}' for veg in unique_vegetables]
    print(f"Processing columns: {veg_columns}")
    
    model_predictions = {}
    
    for name, model in models_dict.items():
        print(f"\nGenerating predictions for {name}...")
        model.fit(X_train_scaled, y_train)
        model_predictions[name] = model.predict(X_test_scaled)
    
    _create_vegetable_plots(X_test, y_test, model_predictions, veg_columns)
    _create_error_distribution_plots(X_test, y_test, model_predictions, veg_columns)

def _create_vegetable_plots(X_test, y_test, model_predictions, veg_columns):
    """Create individual vegetable prediction plots"""
    for veg_col in veg_columns:
        veg_name = veg_col.replace('Vegetable_', '')
        veg_mask = X_test[veg_col] == 1
        veg_actual = y_test[veg_mask]
        
        if len(veg_actual) == 0:
            continue
            
        n_models = len(model_predictions)
        n_cols = 2
        n_rows = (n_models + 1) // 2
        
        plt.figure(figsize=(15, 5 * n_rows))
        plt.suptitle(f'{veg_name} - Model Predictions Comparison', fontsize=16, y=0.95)
        
        for idx, (model_name, predictions) in enumerate(model_predictions.items()):
            veg_pred = predictions[veg_mask]
            
            # Calculate metrics
            mse = mean_squared_error(veg_actual, veg_pred)
            rmse = np.sqrt(mse)
            r2 = r2_score(veg_actual, veg_pred)
            mae = mean_absolute_error(veg_actual, veg_pred)
            
            plt.subplot(n_rows, n_cols, idx + 1)
            
            # Scatter plot
            plt.scatter(veg_actual, veg_pred, alpha=0.5, label='Predictions')
            
            # Perfect prediction line
            min_val = min(veg_actual.min(), veg_pred.min())
            max_val = max(veg_actual.max(), veg_pred.max())
            plt.plot([min_val, max_val], [min_val, max_val], 'r--', label='Perfect Prediction')
            
            plt.xlabel('Actual Price')
            plt.ylabel('Predicted Price')
            plt.title(f'{model_name} Model')
            plt.legend()
            
            # Add metrics text box
            plt.text(0.05, 0.95, 
                    f'RMSE: {rmse:.2f}\nMAE: {mae:.2f}\nR²: {r2:.2f}',
                    transform=plt.gca().transAxes,
                    verticalalignment='top',
                    bbox=dict(boxstyle='round', facecolor='white', alpha=0.8))
        
        plt.tight_layout()
        plt.savefig(f'{veg_name}_model_comparison.png', bbox_inches='tight')
        plt.close()

def _create_error_distribution_plots(X_test, y_test, model_predictions, veg_columns):
    """Create error distribution plots for each vegetable"""
    for veg_col in veg_columns:
        veg_name = veg_col.replace('Vegetable_', '')
        veg_mask = X_test[veg_col] == 1
        veg_actual = y_test[veg_mask]
        
        if len(veg_actual) == 0:
            continue
        
        plt.figure(figsize=(15, 5))
        plt.suptitle(f'{veg_name} - Prediction Error Distribution by Model', fontsize=16)
        
        for idx, (model_name, predictions) in enumerate(model_predictions.items()):
            veg_pred = predictions[veg_mask]
            errors = veg_pred - veg_actual
            
            plt.subplot(1, len(model_predictions), idx + 1)
            sns.histplot(errors, kde=True)
            plt.xlabel('Prediction Error')
            plt.ylabel('Count')
            plt.title(f'{model_name}')
        
        plt.tight_layout()
        plt.savefig(f'{veg_name}_error_distribution.png', bbox_inches='tight')
        plt.close()

def plot_feature_importance(model, feature_names, title):
    """Plot feature importance for tree-based models"""
    importance = pd.DataFrame({
        'feature': feature_names,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    plt.figure(figsize=(10, 6))
    sns.barplot(x='importance', y='feature', data=importance.head(15))
    plt.title(f'{title} Feature Importance')
    plt.xlabel('Importance Score')
    plt.ylabel('Feature')
    plt.tight_layout()
    plt.savefig(f'{title.lower().replace(" ", "_")}_importance.png')
    plt.close()

def plot_seasonal_patterns(df):
    """Plot seasonal patterns in the data"""
    plt.figure(figsize=(15, 10))
    
    # Monthly average prices
    plt.subplot(2, 1, 1)
    monthly_avg = df.groupby(['Month_Num'])['Price'].mean()
    sns.lineplot(x=monthly_avg.index, y=monthly_avg.values)
    plt.title('Average Price by Month')
    plt.xlabel('Month')
    plt.ylabel('Average Price')
    
    # Seasonal box plots
    plt.subplot(2, 1, 2)
    sns.boxplot(x='Season', y='Price', data=df)
    plt.title('Price Distribution by Season')
    plt.xlabel('Season')
    plt.ylabel('Price')
    
    plt.tight_layout()
    plt.savefig('seasonal_patterns.png')
    plt.close()

def plot_price_trends(df):
    """Plot price trends over time"""
    plt.figure(figsize=(15, 8))
    
    # Yearly trends
    yearly_avg = df.groupby(['Year', 'Vegetable'])['Price'].mean().unstack()
    yearly_avg.plot(marker='o')
    plt.title('Yearly Price Trends by Vegetable')
    plt.xlabel('Year')
    plt.ylabel('Average Price')
    plt.legend(title='Vegetable', bbox_to_anchor=(1.05, 1), loc='upper left')
    
    plt.tight_layout()
    plt.savefig('price_trends.png')
    plt.close()

def plot_correlation_matrix(df, numeric_features):
    """Plot correlation matrix for numeric features"""
    plt.figure(figsize=(12, 10))
    
    correlation_matrix = df[numeric_features].corr()
    mask = np.triu(np.ones_like(correlation_matrix), k=1)
    
    sns.heatmap(correlation_matrix, 
                mask=mask,
                annot=True, 
                cmap='coolwarm', 
                center=0,
                fmt='.2f',
                square=True)
    
    plt.title('Feature Correlation Matrix')
    plt.tight_layout()
    plt.savefig('correlation_matrix.png')
    plt.close()