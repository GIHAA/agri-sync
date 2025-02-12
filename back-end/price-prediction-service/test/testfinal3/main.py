# main.py
from sklearn.model_selection import TimeSeriesSplit
import pandas as pd
import numpy as np

from data_preprocessing import (
    load_and_preprocess_data,
    prepare_modeling_data,
    remove_outliers,
    scale_features
)
from models import create_ensemble_model, create_baseline_models
from evaluation import compare_models
from visualization import (
    plot_model_comparison,
    plot_model_vegetable_comparison,
    plot_feature_importance,
    plot_seasonal_patterns,
    plot_price_trends,
    plot_correlation_matrix
)
from config import NUMERIC_FEATURES, CATEGORICAL_FEATURES

def main():
    # Load and prepare data
    print("Loading and preprocessing data...")
    df = load_and_preprocess_data('data.csv')
    
    # Create initial visualizations
    print("\nCreating exploratory visualizations...")
    plot_seasonal_patterns(df)
    plot_price_trends(df)
    plot_correlation_matrix(df, NUMERIC_FEATURES)
    
    # Prepare modeling data
    print("\nPreparing data for modeling...")
    X, y = prepare_modeling_data(df, NUMERIC_FEATURES, CATEGORICAL_FEATURES)
    
    # Remove outliers
    print("\nRemoving outliers...")
    X, y = remove_outliers(X, y)
    
    # Split data
    print("\nSplitting data...")
    tscv = TimeSeriesSplit(n_splits=5)
    split = list(tscv.split(X))
    train_idx, test_idx = split[-1]
    
    X_train, X_test = X.iloc[train_idx], X.iloc[test_idx]
    y_train, y_test = y.iloc[train_idx], y.iloc[test_idx]
    
    # Scale features
    print("\nScaling features...")
    X_train_scaled, X_test_scaled, _ = scale_features(X_train, X_test)
    
    # Create models
    print("\nCreating models...")
    ensemble = create_ensemble_model()
    baseline_models = create_baseline_models()
    all_models = {**baseline_models, 'Ensemble': ensemble}
    
    # Compare models
    print("\nComparing models...")
    results_df = compare_models(X_train_scaled, X_test_scaled, y_train, y_test, all_models)
    
    # Print detailed results
    print("\nDetailed Model Comparison:")
    print(results_df.to_string(index=False))
    
    # Create visualizations
    print("\nCreating model comparison visualizations...")
    plot_model_comparison(results_df)
    plot_model_vegetable_comparison(
        X_test, y_test, all_models,
        X_train_scaled, X_test_scaled,
        y_train, df
    )
    
    # Plot feature importance for tree-based models
    print("\nPlotting feature importance...")
    plot_feature_importance(
        ensemble.named_estimators_['rf'],
        X.columns,
        'Random Forest'
    )
    
    print("\nAnalysis complete! Check the output directory for visualizations.")

if __name__ == "__main__":
    main()