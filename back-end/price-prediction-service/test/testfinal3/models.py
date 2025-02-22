# models.py
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, VotingRegressor
from sklearn.linear_model import LassoCV, RidgeCV, ElasticNetCV
from sklearn.svm import SVR
import xgboost as xgb
from config import RF_PARAMS, GB_PARAMS, XGB_PARAMS

def create_ensemble_model():
    """Create an ensemble of multiple models"""
    rf = RandomForestRegressor(**RF_PARAMS)
    gb = GradientBoostingRegressor(**GB_PARAMS)
    xgb_model = xgb.XGBRegressor(**XGB_PARAMS)
    
    ensemble = VotingRegressor(
        estimators=[
            ('rf', rf),
            ('gb', gb),
            ('xgb', xgb_model)
        ]
    )
    
    return ensemble

def create_baseline_models():
    """Create baseline models for comparison"""
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