import pandas as pd
import numpy as np
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, ExtraTreesRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.pipeline import Pipeline
import matplotlib.pyplot as plt
import seaborn as sns
import logging
import time
from datetime import datetime

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('model_training.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def plot_model_comparison(results):
    logger.info("Creating model comparison visualizations...")
    
    plt.rcParams['figure.facecolor'] = 'white'
    plt.rcParams['axes.facecolor'] = 'white'
    plt.rcParams['axes.grid'] = True
    plt.rcParams['grid.alpha'] = 0.3
    
    metrics = ['R2', 'RMSE', 'MAE', 'MAPE']
    
    fig, axes = plt.subplots(2, 2, figsize=(15, 12))
    fig.suptitle('Model Performance Comparison', fontsize=16, y=1.02)
    
    for idx, metric in enumerate(metrics):
        ax = axes[idx//2, idx%2]
        bars = ax.bar(results['Model'], results[metric])
        ax.set_title(f'{metric} Comparison')
        ax.set_xticklabels(results['Model'], rotation=45)
        
        for bar in bars:
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height,
                    f'{height:.3f}',
                    ha='center', va='bottom')
    
    plt.tight_layout()
    plt.savefig('model_comparison.png', dpi=300, bbox_inches='tight')
    plt.close()

def plot_prediction_analysis(models, X_test, y_test):
    logger.info("Creating prediction analysis plots...")
    
    fig, axes = plt.subplots(len(models), 2, figsize=(15, 5*len(models)))
    fig.suptitle('Model Prediction Analysis', fontsize=16, y=1.02)
    
    for idx, (name, model) in enumerate(models.items()):
        y_pred = model.predict(X_test)
        
        # Scatter plot
        axes[idx, 0].scatter(y_test, y_pred, alpha=0.5)
        axes[idx, 0].plot([y_test.min(), y_test.max()], 
                        [y_test.min(), y_test.max()], 
                        'r--', lw=2)
        axes[idx, 0].set_title(f'{name}: Actual vs Predicted')
        axes[idx, 0].set_xlabel('Actual Values')
        axes[idx, 0].set_ylabel('Predicted Values')
        
        # Residual plot
        residuals = y_test - y_pred
        axes[idx, 1].scatter(y_pred, residuals, alpha=0.5)
        axes[idx, 1].axhline(y=0, color='r', linestyle='--')
        axes[idx, 1].set_title(f'{name}: Residuals Plot')
        axes[idx, 1].set_xlabel('Predicted Values')
        axes[idx, 1].set_ylabel('Residuals')
        
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        r2 = r2_score(y_test, y_pred)
        axes[idx, 0].text(0.05, 0.95, f'RMSE: {rmse:.2f}\nR²: {r2:.2f}',
                        transform=axes[idx, 0].transAxes,
                        bbox=dict(facecolor='white', alpha=0.8))
    
    plt.tight_layout()
    plt.savefig('prediction_analysis.png', dpi=300, bbox_inches='tight')
    plt.close()

def plot_error_distribution(models, X_test, y_test):
    logger.info("Creating error distribution plots...")
    
    fig, axes = plt.subplots(len(models), 1, figsize=(12, 4*len(models)))
    fig.suptitle('Error Distribution Analysis', fontsize=16, y=1.02)
    
    if len(models) == 1:
        axes = [axes]
    
    for idx, (name, model) in enumerate(models.items()):
        y_pred = model.predict(X_test)
        errors = y_test - y_pred
        
        sns.histplot(errors, kde=True, ax=axes[idx])
        axes[idx].set_title(f'{name}: Error Distribution')
        axes[idx].set_xlabel('Prediction Error')
        axes[idx].set_ylabel('Count')
        
        mean_error = errors.mean()
        std_error = errors.std()
        axes[idx].text(0.05, 0.95, 
                     f'Mean Error: {mean_error:.2f}\nStd Dev: {std_error:.2f}',
                     transform=axes[idx].transAxes,
                     bbox=dict(facecolor='white', alpha=0.8))
    
    plt.tight_layout()
    plt.savefig('error_distribution.png', dpi=300, bbox_inches='tight')
    plt.close()

# Start timing
start_time = time.time()
logger.info("Starting model training process")

try:
    # Load and prepare data
    logger.info("Loading data from CSV file...")
    df = pd.read_csv("data.csv")
    
    # Log initial data shape
    logger.info(f"Initial data shape: {df.shape}")

    # Enhanced feature engineering
    def create_features(df):
        logger.info("Creating features...")
        
        # Convert month to numeric
        month_map = {
            'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'may': 5, 'jun': 6,
            'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12
        }
        df['month_num'] = df['month'].str.lower().map(month_map)
        
        # Create seasonal features for Sri Lanka
        def get_sri_lanka_season(month):
            if month in [3, 4]:
                return 'First Inter-monsoon'
            elif month in [5, 6, 7, 8, 9]:
                return 'Southwest Monsoon'
            elif month in [10, 11]:
                return 'Second Inter-monsoon'
            else:  # month in [12, 1, 2]
                return 'Northeast Monsoon'

        df['season'] = df['month_num'].apply(get_sri_lanka_season)
        
        # Create price momentum features
        df['last_month_price'] = df.groupby(['item', 'district'])['price'].shift(1)
        df['price_change'] = df['price'] - df['last_month_price']
        
        # Create rolling statistics
        df['rolling_mean_price'] = df.groupby(['item', 'district'])['price'].transform(
            lambda x: x.rolling(window=3, min_periods=1).mean())
        df['rolling_std_price'] = df.groupby(['item', 'district'])['price'].transform(
            lambda x: x.rolling(window=3, min_periods=1).std())
        
        # Create interaction features
        df['price_volatility'] = df['rolling_std_price'] / df['rolling_mean_price']
        df['rain_temp_interaction'] = df['rain'] * df['temperature']
        
        return df

    # Apply feature engineering
    df = create_features(df)
    df = df.dropna()  # Remove rows with NaN values after feature engineering
    logger.info(f"Data shape after feature engineering: {df.shape}")

    # Encode categorical variables
    logger.info("Encoding categorical variables...")
    categorical_columns = ['item', 'district', 'season']
    encoders = {}
    
    for col in categorical_columns:
        encoders[col] = LabelEncoder()
        df[col] = encoders[col].fit_transform(df[col])

    # Prepare feature matrix and target vector
    feature_columns = [
        'year', 'month_num', 'temperature', 'rain', 'LP95', 'LP92', 'LAD', 
        'LSD', 'LK', 'LIK', 'item', 'district', 'season', 'rolling_mean_price',
        'rolling_std_price', 'price_volatility', 'rain_temp_interaction'
    ]
    
    X = df[feature_columns]
    y = df['price']

    logger.info(f"Final feature set: {feature_columns}")
    logger.info(f"Feature matrix shape: {X.shape}")

    # Split data with stratification
    logger.info("Splitting data into train and test sets...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42,
        stratify=pd.qcut(df['price'], q=5, duplicates='drop').astype(str)
    )
    logger.info(f"Training set size: {X_train.shape[0]}, Test set size: {X_test.shape[0]}")

    # Define parameter grids
    logger.info("Defining parameter grids...")
    # rf_params = {
    #     'n_estimators': [100, 200],
    #     'max_depth': [10, 15],
    #     'min_samples_split': [2, 5],
    #     'min_samples_leaf': [1, 2],
    #     'max_features': ['sqrt', 'log2']
    # }

    # gb_params = {
    #     'n_estimators': [100, 200],
    #     'learning_rate': [0.05, 0.1],
    #     'max_depth': [3, 5],
    #     'subsample': [0.8, 0.9],
    #     'min_samples_split': [2, 5],
    #     'min_samples_leaf': [1, 2]
    # }

    # et_params = {
    #     'n_estimators': [100, 200],
    #     'max_depth': [10, 15],
    #     'min_samples_split': [2, 5],
    #     'min_samples_leaf': [1, 2],
    #     'max_features': ['sqrt', 'log2']
    # }
    
    rf_params = {
        'n_estimators': [100, 200 , 300],
        'max_depth': [10, 15 , 20],
        'min_samples_split': [2, 5 , 10],
        'min_samples_leaf': [1, 2],
        'max_features': ['sqrt', 'log2']
    }

    gb_params = {
        'n_estimators': [100, 200 , 300],
        'learning_rate': [0.05, 0.1],
        'max_depth': [3, 5 , 7 , 10],
        'subsample': [0.8, 0.9 , 1.0],
        'min_samples_split': [2, 5],
        'min_samples_leaf': [1, 2]
    }

    et_params = {
        'n_estimators': [100, 200 , 300],
        'max_depth': [10, 15 , 20 , 25],
        'min_samples_split': [2, 5],
        'min_samples_leaf': [1, 2],
        'max_features': ['sqrt', 'log2']
    }

    # Create pipelines with preprocessing
    logger.info("Creating model pipelines...")
    rf_pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('rf', RandomForestRegressor(random_state=42))
    ])

    gb_pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('gb', GradientBoostingRegressor(random_state=42))
    ])

    et_pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('et', ExtraTreesRegressor(random_state=42))
    ])

    # Modified parameter grids for pipelines
    rf_pipeline_params = {f'rf__{key}': value for key, value in rf_params.items()}
    gb_pipeline_params = {f'gb__{key}': value for key, value in gb_params.items()}
    et_pipeline_params = {f'et__{key}': value for key, value in et_params.items()}

    # Perform Grid Search with cross-validation
    def train_model(pipeline, params, name):
        logger.info(f"Training {name} model...")
        start = time.time()
        
        grid_search = GridSearchCV(
            estimator=pipeline,
            param_grid=params,
            scoring=['neg_mean_squared_error', 'r2'],
            refit='neg_mean_squared_error',
            cv=5,
            verbose=2,
            n_jobs=-1
        )
        grid_search.fit(X_train, y_train)
        
        duration = time.time() - start
        logger.info(f"{name} training completed in {duration:.2f} seconds")
        logger.info(f"Best {name} score: {grid_search.best_score_:.4f}")
        return grid_search

    # Train models
    logger.info("Starting model training...")
    rf_grid = train_model(rf_pipeline, rf_pipeline_params, "Random Forest")
    gb_grid = train_model(gb_pipeline, gb_pipeline_params, "Gradient Boosting")
    et_grid = train_model(et_pipeline, et_pipeline_params, "Extra Trees")

    # Evaluate models
    def evaluate_model(model, name):
        logger.info(f"Evaluating {name} model...")
        y_pred = model.predict(X_test)
        mse = mean_squared_error(y_test, y_pred)
        rmse = np.sqrt(mse)
        r2 = r2_score(y_test, y_pred)
        mae = mean_absolute_error(y_test, y_pred)
        mape = np.mean(np.abs((y_test - y_pred) / y_test)) * 100
        
        return {
            'Model': name,
            'R2': r2,
            'MSE': mse,
            'RMSE': rmse,
            'MAE': mae,
            'MAPE': mape
        }

    # Calculate metrics for each model
    logger.info("Calculating final metrics...")
    results = pd.DataFrame([
        evaluate_model(rf_grid, 'Random Forest'),
        evaluate_model(gb_grid, 'Gradient Boosting'),
        evaluate_model(et_grid, 'Extra Trees')
    ])

    # Print results
    logger.info("\nModel Performance Metrics:")
    logger.info("\n" + str(results.round(4)))

    # Get best model
    # Create a mapping of model names to their grid objects
    model_mapping = {
        'Random Forest': rf_grid,
        'Gradient Boosting': gb_grid,
        'Extra Trees': et_grid
    }

    best_model_idx = results['R2'].idxmax()
    best_model_name = results.loc[best_model_idx, 'Model']
    best_model = model_mapping[best_model_name]

    logger.info(f"\nBest Model: {best_model_name}")
    logger.info("Best Parameters:")
    logger.info(best_model.best_params_)

    # Feature importance analysis for the best model
    def plot_feature_importance(model, feature_names):
        logger.info("Plotting feature importance...")
        if hasattr(model, 'feature_importances_'):
            importances = model.feature_importances_
            indices = np.argsort(importances)[::-1]
            
            plt.figure(figsize=(12, 6))
            plt.title('Feature Importances')
            plt.bar(range(len(feature_names)), importances[indices])
            plt.xticks(range(len(feature_names)), [feature_names[i] for i in indices], rotation=45, ha='right')
            plt.tight_layout()
            plt.savefig('feature_importance.png', bbox_inches='tight')
            plt.close()
            
            # Also log the feature importances
            importance_dict = dict(zip([feature_names[i] for i in indices], importances[indices]))
            logger.info("\nFeature Importances:")
            for feature, importance in importance_dict.items():
                logger.info(f"{feature}: {importance:.4f}")

    # Create visualizations
    logger.info("Generating model comparison visualizations...")
    
    # Plot overall model comparison
    plot_model_comparison(results)
    
    # Get best estimator and plot feature importance
    best_estimator = best_model.best_estimator_
    if best_model_name == 'Random Forest':
        plot_feature_importance(best_estimator.named_steps['rf'], feature_columns)
    elif best_model_name == 'Gradient Boosting':
        plot_feature_importance(best_estimator.named_steps['gb'], feature_columns)
    else:
        plot_feature_importance(best_estimator.named_steps['et'], feature_columns)
    
    # Create dictionary of models for prediction analysis
    models = {
        'Random Forest': rf_grid,
        'Gradient Boosting': gb_grid,
        'Extra Trees': et_grid
    }
    
    # Plot prediction analysis
    plot_prediction_analysis(models, X_test, y_test)
    
    # Plot error distribution
    plot_error_distribution(models, X_test, y_test)
    
    # Save the best model and encoders
    logger.info("Saving best model and encoders...")
    import pickle
    
    # Save the best model
    with open('best_model.pkl', 'wb') as f:
        pickle.dump(best_estimator, f)
    
    # Save the encoders
    with open('encoders.pkl', 'wb') as f:
        pickle.dump(encoders, f)
    
    # Save feature columns
    with open('feature_columns.pkl', 'wb') as f:
        pickle.dump(feature_columns, f)
    
    # Create a prediction function that can be used later
    def make_prediction(model, encoders, feature_columns, input_data):
        """
        Make predictions using the saved model
        
        Parameters:
        -----------
        model : sklearn estimator
            The trained model
        encoders : dict
            Dictionary of label encoders for categorical variables
        feature_columns : list
            List of feature columns in the correct order
        input_data : dict
            Dictionary containing the input data
            
        Returns:
        --------
        float
            Predicted price
        """
        # Create a DataFrame with one row
        df = pd.DataFrame([input_data])
        
        # Encode categorical variables
        for col in ['item', 'district', 'season']:
            if col in df.columns:
                df[col] = encoders[col].transform(df[col])
        
        # Ensure all feature columns are present
        for col in feature_columns:
            if col not in df.columns:
                df[col] = 0
        
        # Return prediction
        return model.predict(df[feature_columns])[0]
    
    # Save the prediction function
    with open('predict_function.pkl', 'wb') as f:
        pickle.dump(make_prediction, f)
    
    # Print example usage
    logger.info("\nExample usage of the saved model:")
    logger.info("""
    import pickle
    
    # Load the model and supporting files
    with open('best_model.pkl', 'rb') as f:
        model = pickle.load(f)
    with open('encoders.pkl', 'rb') as f:
        encoders = pickle.load(f)
    with open('feature_columns.pkl', 'rb') as f:
        feature_columns = pickle.load(f)
    with open('predict_function.pkl', 'rb') as f:
        predict = pickle.load(f)
    
    # Example input data
    input_data = {
        'year': 2024,
        'month_num': 1,
        'temperature': 28.5,
        'rain': 100.0,
        'LP95': 130,
        'LP92': 120,
        'LAD': 100,
        'LSD': 115,
        'LK': 65,
        'LIK': 90,
        'item': 'samba 1',
        'district': 'colombo',
        'season': 'Northeast Monsoon'
    }
    
    # Make prediction
    predicted_price = predict(model, encoders, feature_columns, input_data)
    print(f'Predicted price: {predicted_price:.2f}')
    """)

    # Calculate total runtime
    total_time = time.time() - start_time
    logger.info(f"\nTotal execution time: {total_time:.2f} seconds")

except Exception as e:
    logger.error(f"An error occurred: {str(e)}", exc_info=True)
    raise