# visualization.py
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import numpy as np

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
        X_test = pd.DataFrame(X_test, columns=X_test.columns)
    
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
        
        for idx, (model_name,