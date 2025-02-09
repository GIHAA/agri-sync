import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, TimeSeriesSplit, cross_val_score
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, VotingRegressor
from sklearn.linear_model import LassoCV, RidgeCV, ElasticNetCV
from sklearn.svm import SVR
from sklearn.preprocessing import StandardScaler, RobustScaler
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import xgboost as xgb
from sklearn.pipeline import Pipeline
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

# Enhanced data loading and preprocessing
def load_and_preprocess_data(file_path):
    # Read the CSV file
    df = pd.read_csv(file_path)
    
    # Print initial data info
    print("\nInitial data info:")
    print(df.info())
    print("\nSample of data:")
    print(df.head())
    
    # Rename columns appropriately
    df.columns = ['Index', 'Year', 'Vegetable', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                 
    # Print unique vegetables after loading
    print(f"\nUnique vegetables in raw data: {df['Vegetable'].unique()}")
    
    # Drop unnecessary columns and clean data
    df = df.drop(columns=['Index'])
    df = df[df['Year'].notna()]
    
    # Convert to numeric and handle errors
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    for month in months:
        df[month] = pd.to_numeric(df[month], errors='coerce')
    df['Year'] = pd.to_numeric(df['Year'], errors='coerce')
    
    # Reshape to long format
    df_long = df.melt(id_vars=['Year', 'Vegetable'], 
                     value_vars=months,
                     var_name='Month', 
                     value_name='Price')
    
    return enhance_features(df_long)

def enhance_features(df):
    """Enhanced feature engineering"""
    # Create month number
    month_map = {
        'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
        'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
    }
    df['Month_Num'] = df['Month'].map(month_map)
    
    # Add seasonal features
    df['Season'] = pd.cut(df['Month_Num'], 
                         bins=[0, 3, 6, 9, 12],
                         labels=['Winter', 'Spring', 'Summer', 'Fall'])
    
    # Add cyclical month features
    df['Month_Sin'] = np.sin(2 * np.pi * df['Month_Num']/12)
    df['Month_Cos'] = np.cos(2 * np.pi * df['Month_Num']/12)
    
    # Add rolling statistics per vegetable
    df = df.sort_values(['Vegetable', 'Year', 'Month_Num'])
    
    # Add price momentum features
    df['Price_Momentum'] = df.groupby('Vegetable')['Price'].transform(
        lambda x: x.pct_change()
    )
    
    # Add rolling mean and std with different windows
    for window in [3, 6]:
        df[f'Rolling_Mean_{window}'] = df.groupby('Vegetable')['Price'].transform(
            lambda x: x.rolling(window=window, min_periods=1).mean()
        )
        df[f'Rolling_Std_{window}'] = df.groupby('Vegetable')['Price'].transform(
            lambda x: x.rolling(window=window, min_periods=1).std()
        )
    
    # Add lag features
    for lag in [1, 3, 6]:
        df[f'Price_Lag_{lag}'] = df.groupby('Vegetable')['Price'].shift(lag)
    
    # Handle missing values created by features
    df = df.fillna(method='bfill').fillna(method='ffill')
    
    return df

def prepare_modeling_data(df):
    """Prepare data for modeling with enhanced feature selection"""
    # Print unique vegetables before processing
    print(f"\nUnique vegetables in dataset: {df['Vegetable'].unique()}")
    
    # Select features
    numeric_features = ['Year', 'Month_Num', 'Month_Sin', 'Month_Cos',
                       'Price_Momentum', 'Rolling_Mean_3', 'Rolling_Mean_6',
                       'Rolling_Std_3', 'Rolling_Std_6',
                       'Price_Lag_1', 'Price_Lag_3', 'Price_Lag_6']
    
    categorical_features = ['Vegetable', 'Season']
    
    # Create feature matrix
    X = pd.get_dummies(df[numeric_features + categorical_features], 
                      columns=categorical_features)
    y = df['Price']
    
    return X, y

def remove_outliers(X, y, threshold=3):
    """Remove outliers using z-score method"""
    z_scores = np.abs((y - y.mean()) / y.std())
    mask = z_scores < threshold
    return X[mask], y[mask]

def create_ensemble_model():
    """Create an ensemble of multiple models"""
    rf = RandomForestRegressor(
        n_estimators=200,
        max_depth=15,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42
    )
    
    gb = GradientBoostingRegressor(
        n_estimators=150,
        learning_rate=0.05,
        max_depth=6,
        subsample=0.8,
        random_state=42
    )
    
    xgb_model = xgb.XGBRegressor(
        n_estimators=200,
        learning_rate=0.05,
        max_depth=6,
        subsample=0.8,
        random_state=42
    )
    
    ensemble = VotingRegressor(
        estimators=[
            ('rf', rf),
            ('gb', gb),
            ('xgb', xgb_model)
        ]
    )
    
    return ensemble

def create_baseline_models():
    """Create a dictionary of baseline models for comparison"""
    models = {
        'Lasso': LassoCV(
            cv=5,
            random_state=42,
            max_iter=2000
        ),
        'Ridge': RidgeCV(
            cv=5
        ),
        'ElasticNet': ElasticNetCV(
            cv=5,
            random_state=42,
            max_iter=2000
        ),
        'SVR': SVR(
            kernel='rbf',
            C=1.0,
            epsilon=0.1
        )
    }
    return models

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

def compare_models(X_train_scaled, X_test_scaled, y_train, y_test):
    """Compare performance of multiple models"""
    # Get the ensemble model
    ensemble = create_ensemble_model()
    
    # Get baseline models
    baseline_models = create_baseline_models()
    
    # Add ensemble to models dictionary
    all_models = {**baseline_models, 'Ensemble': ensemble}
    
    # Dictionary to store results
    results = {
        'Model': [],
        'R2': [],
        'RMSE': [],
        'MAE': [],
        'MAPE': [],
        'Cross_Val_Score': []
    }
    
    # Evaluate each model
    for name, model in all_models.items():
        print(f"\nTraining and evaluating {name}...")
        
        # Train model
        model.fit(X_train_scaled, y_train)
        
        # Get metrics
        metrics, _ = evaluate_model(model, X_test_scaled, y_test)
        
        # Calculate cross-validation score
        cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5, scoring='r2')
        
        # Store results
        results['Model'].append(name)
        results['R2'].append(metrics['R2'])
        results['RMSE'].append(metrics['RMSE'])
        results['MAE'].append(metrics['MAE'])
        results['MAPE'].append(metrics['MAPE'])
        results['Cross_Val_Score'].append(cv_scores.mean())
    
    return pd.DataFrame(results)

def plot_model_comparison(results):
    """Create visualizations comparing model performance"""
    # Set up the figure
    fig, axes = plt.subplots(2, 2, figsize=(15, 12))
    fig.suptitle('Model Performance Comparison', fontsize=16, y=1.02)
    
    # Plot R2 scores
    sns.barplot(x='Model', y='R2', data=results, ax=axes[0,0])
    axes[0,0].set_title('R² Score by Model')
    axes[0,0].set_xticklabels(axes[0,0].get_xticklabels(), rotation=45)
    
    # Plot RMSE
    sns.barplot(x='Model', y='RMSE', data=results, ax=axes[0,1])
    axes[0,1].set_title('RMSE by Model')
    axes[0,1].set_xticklabels(axes[0,1].get_xticklabels(), rotation=45)
    
    # Plot MAE
    sns.barplot(x='Model', y='MAE', data=results, ax=axes[1,0])
    axes[1,0].set_title('MAE by Model')
    axes[1,0].set_xticklabels(axes[1,0].get_xticklabels(), rotation=45)
    
    # Plot Cross-validation scores
    sns.barplot(x='Model', y='Cross_Val_Score', data=results, ax=axes[1,1])
    axes[1,1].set_title('Cross-validation Score by Model')
    axes[1,1].set_xticklabels(axes[1,1].get_xticklabels(), rotation=45)
    
    plt.tight_layout()
    plt.savefig('model_comparison.png')
    plt.close()
    
    return fig

def plot_model_vegetable_comparison(X_test, y_test, models_dict, X_train_scaled, X_test_scaled, y_train, original_df):
    """Create comparison plots for each vegetable showing predictions from all models"""
    # Convert X_test back to dataframe if it's numpy array
    if isinstance(X_test, np.ndarray):
        X_test = pd.DataFrame(X_test, columns=X.columns)
    
    # Get unique vegetables from original data
    unique_vegetables = original_df['Vegetable'].unique()
    print(f"Found vegetables: {unique_vegetables}")
    
    # Get vegetable columns
    veg_columns = [f'Vegetable_{veg}' for veg in unique_vegetables]
    print(f"Processing columns: {veg_columns}")
    
    # Dictionary to store predictions for each model
    model_predictions = {}
    
    # Get predictions from all models
    for name, model in models_dict.items():
        print(f"\nGenerating predictions for {name}...")
        model.fit(X_train_scaled, y_train)
        model_predictions[name] = model.predict(X_test_scaled)
    
    # Create plots for each vegetable
    for veg_col in veg_columns:
        veg_name = veg_col.replace('Vegetable_', '')
        veg_mask = X_test[veg_col] == 1
        veg_actual = y_test[veg_mask]
        
        if len(veg_actual) == 0:
            continue
        
        # Create subplot grid based on number of models
        n_models = len(models_dict)
        n_cols = 2
        n_rows = (n_models + 1) // 2
        
        plt.figure(figsize=(15, 5 * n_rows))
        plt.suptitle(f'{veg_name} - Model Predictions Comparison', fontsize=16, y=0.95)
        
        # Plot for each model
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

        # Create error distribution comparison
        plt.figure(figsize=(15, 5))
        plt.suptitle(f'{veg_name} - Prediction Error Distribution by Model', fontsize=16)
        
        for idx, (model_name, predictions) in enumerate(model_predictions.items()):
            veg_pred = predictions[veg_mask]
            errors = veg_pred - veg_actual
            
            plt.subplot(1, len(models_dict), idx + 1)
            sns.histplot(errors, kde=True)
            plt.xlabel('Prediction Error')
            plt.ylabel('Count')
            plt.title(f'{model_name}')
        
        plt.tight_layout()
        plt.savefig(f'{veg_name}_error_distribution.png', bbox_inches='tight')
        plt.close()

# Main execution
if __name__ == "__main__":
    # Load and prepare data
    df = load_and_preprocess_data('data.csv')
    X, y = prepare_modeling_data(df)
    
    # Remove outliers
    X, y = remove_outliers(X, y)
    
    # Split data with time-based split
    tscv = TimeSeriesSplit(n_splits=5)
    split = list(tscv.split(X))
    train_idx, test_idx = split[-1]
    
    X_train, X_test = X.iloc[train_idx], X.iloc[test_idx]
    y_train, y_test = y.iloc[train_idx], y.iloc[test_idx]
    
    # Scale features
    scaler = RobustScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Compare models
    results_df = compare_models(X_train_scaled, X_test_scaled, y_train, y_test)
    
    # Print detailed results
    print("\nDetailed Model Comparison:")
    print(results_df.to_string(index=False))
    
    # Create overall model comparison visualization
    plot_model_comparison(results_df)
    
    # Get all models for vegetable-specific comparison
    ensemble = create_ensemble_model()
    baseline_models = create_baseline_models()
    all_models = {**baseline_models, 'Ensemble': ensemble}
    
    # Create vegetable-specific comparison plots
    plot_model_vegetable_comparison(X_test, y_test, all_models, X_train_scaled, X_test_scaled, y_train, df)