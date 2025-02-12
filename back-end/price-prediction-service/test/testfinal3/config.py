# config.py
import warnings
warnings.filterwarnings('ignore')

# Model parameters
RF_PARAMS = {
    'n_estimators': 200,
    'max_depth': 15,
    'min_samples_split': 5,
    'min_samples_leaf': 2,
    'random_state': 42
}

GB_PARAMS = {
    'n_estimators': 150,
    'learning_rate': 0.05,
    'max_depth': 6,
    'subsample': 0.8,
    'random_state': 42
}

XGB_PARAMS = {
    'n_estimators': 200,
    'learning_rate': 0.05,
    'max_depth': 6,
    'subsample': 0.8,
    'random_state': 42
}

# Feature engineering parameters
ROLLING_WINDOWS = [3, 6]
LAG_PERIODS = [1, 3, 6]
OUTLIER_THRESHOLD = 3

# Data preprocessing
MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

MONTH_MAP = {
    'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
    'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
}

# Feature lists
NUMERIC_FEATURES = ['Year', 'Month_Num', 'Month_Sin', 'Month_Cos',
                   'Price_Momentum', 'Rolling_Mean_3', 'Rolling_Mean_6',
                   'Rolling_Std_3', 'Rolling_Std_6',
                   'Price_Lag_1', 'Price_Lag_3', 'Price_Lag_6']

CATEGORICAL_FEATURES = ['Vegetable', 'Season']