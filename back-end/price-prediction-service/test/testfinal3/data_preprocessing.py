# data_preprocessing.py
import pandas as pd
import numpy as np
from sklearn.preprocessing import RobustScaler
from config import MONTHS, MONTH_MAP, ROLLING_WINDOWS, LAG_PERIODS, OUTLIER_THRESHOLD

def load_and_preprocess_data(file_path):
    """Load and preprocess the data"""
    df = pd.read_csv(file_path)
    
    print("\nInitial data info:")
    print(df.info())
    print("\nSample of data:")
    print(df.head())
    
    df.columns = ['Index', 'Year', 'Vegetable', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    print(f"\nUnique vegetables in raw data: {df['Vegetable'].unique()}")
    
    df = df.drop(columns=['Index'])
    df = df[df['Year'].notna()]
    
    for month in MONTHS:
        df[month] = pd.to_numeric(df[month], errors='coerce')
    df['Year'] = pd.to_numeric(df['Year'], errors='coerce')
    
    df_long = df.melt(id_vars=['Year', 'Vegetable'], 
                     value_vars=MONTHS,
                     var_name='Month', 
                     value_name='Price')
    
    return enhance_features(df_long)

def enhance_features(df):
    """Add engineered features to the dataset"""
    df['Month_Num'] = df['Month'].map(MONTH_MAP)
    
    df['Season'] = pd.cut(df['Month_Num'], 
                         bins=[0, 3, 6, 9, 12],
                         labels=['Winter', 'Spring', 'Summer', 'Fall'])
    
    df['Month_Sin'] = np.sin(2 * np.pi * df['Month_Num']/12)
    df['Month_Cos'] = np.cos(2 * np.pi * df['Month_Num']/12)
    
    df = df.sort_values(['Vegetable', 'Year', 'Month_Num'])
    
    df['Price_Momentum'] = df.groupby('Vegetable')['Price'].transform(
        lambda x: x.pct_change()
    )
    
    for window in ROLLING_WINDOWS:
        df[f'Rolling_Mean_{window}'] = df.groupby('Vegetable')['Price'].transform(
            lambda x: x.rolling(window=window, min_periods=1).mean()
        )
        df[f'Rolling_Std_{window}'] = df.groupby('Vegetable')['Price'].transform(
            lambda x: x.rolling(window=window, min_periods=1).std()
        )
    
    for lag in LAG_PERIODS:
        df[f'Price_Lag_{lag}'] = df.groupby('Vegetable')['Price'].shift(lag)
    
    df = df.fillna(method='bfill').fillna(method='ffill')
    
    return df

def prepare_modeling_data(df, numeric_features, categorical_features):
    """Prepare final feature matrix for modeling"""
    print(f"\nUnique vegetables in dataset: {df['Vegetable'].unique()}")
    
    X = pd.get_dummies(df[numeric_features + categorical_features], 
                      columns=categorical_features)
    y = df['Price']
    
    return X, y

def remove_outliers(X, y, threshold=OUTLIER_THRESHOLD):
    """Remove outliers using z-score method"""
    z_scores = np.abs((y - y.mean()) / y.std())
    mask = z_scores < threshold
    return X[mask], y[mask]

def scale_features(X_train, X_test):
    """Scale features using RobustScaler"""
    scaler = RobustScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    return X_train_scaled, X_test_scaled, scaler