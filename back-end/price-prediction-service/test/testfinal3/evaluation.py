# evaluation.py
import numpy as np
import pandas as pd
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.model_selection import cross_val_score

def evaluate_model(model, X_test, y_test):
    """Evaluate model with multiple metrics"""
    y_pred = model.predict(X_test)
    
    metrics = {
        'R2': r2_score(y_test, y_pred),
        'RMSE': np.sqrt(mean_squared_error(y_test, y_pred)),
        'MAE': mean_absolute_error(y_test, y_pred),
        'MAPE': np.mean(np.abs((y_test - y_pred) / y_test)) * 100
    }
    
    return metrics, y_pred

def compare_models(X_train_scaled, X_test_scaled, y_train, y_test, models_dict):
    """Compare performance of multiple models"""
    results = {
        'Model': [],
        'R2': [],
        'RMSE': [],
        'MAE': [],
        'MAPE': [],
        'Cross_Val_Score': []
    }
    
    for name, model in models_dict.items():
        print(f"\nTraining and evaluating {name}...")
        
        model.fit(X_train_scaled, y_train)
        metrics, _ = evaluate_model(model, X_test_scaled, y_test)
        cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5, scoring='r2')
        
        results['Model'].append(name)
        results['R2'].append(metrics['R2'])
        results['RMSE'].append(metrics['RMSE'])
        results['MAE'].append(metrics['MAE'])
        results['MAPE'].append(metrics['MAPE'])
        results['Cross_Val_Score'].append(cv_scores.mean())
    
    return pd.DataFrame(results)