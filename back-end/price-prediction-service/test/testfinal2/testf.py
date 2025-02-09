import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, TimeSeriesSplit, cross_val_score
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, VotingRegressor
from sklearn.preprocessing import StandardScaler, RobustScaler
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import xgboost as xgb
from sklearn.pipeline import Pipeline
import warnings
warnings.filterwarnings('ignore')

# Enhanced data loading and preprocessing
def load_and_preprocess_data(file_path):
    # Read the CSV file
    df = pd.read_csv(file_path)
    
    # Rename columns appropriately
    df.columns = ['Index', 'Year', 'Vegetable', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
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
    
    # Create and train ensemble model
    model = create_ensemble_model()
    model.fit(X_train_scaled, y_train)
    
    # Evaluate model
    metrics, y_pred = evaluate_model(model, X_test_scaled, y_test)
    
    # Print results
    print("\nModel Performance Metrics:")
    for metric, value in metrics.items():
        print(f"{metric}: {value:.4f}")
    
    # Create visualization of actual vs predicted values
    import matplotlib.pyplot as plt
    import seaborn as sns
    
    plt.figure(figsize=(12, 6))
    plt.subplot(1, 2, 1)
    plt.scatter(y_test, y_pred, alpha=0.5)
    plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
    plt.xlabel('Actual Prices')
    plt.ylabel('Predicted Prices')
    plt.title('Actual vs Predicted Prices')
    
    plt.subplot(1, 2, 2)
    residuals = y_test - y_pred
    sns.histplot(residuals, kde=True)
    plt.xlabel('Residuals')
    plt.ylabel('Count')
    plt.title('Residuals Distribution')
    
    plt.tight_layout()
    plt.savefig('model_performance.png')
    plt.close()