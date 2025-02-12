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

# Start timing
start_time = time.time()
logger.info("Starting model training process")

try:
    # Load and prepare data
    logger.info("Loading data from Excel file...")
    df = pd.read_excel("data.xlsx", sheet_name="Sheet2", skiprows=2)
    df.columns = ['Index', 'Year', 'Vegetable', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    df = df.drop(columns=['Index'])
    df = df[df['Year'] != 'Year']

    # Log initial data shape
    logger.info(f"Initial data shape: {df.shape}")

    # Ensure the data types are correct
    logger.info("Converting data types...")
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    for month in months:
        df[month] = pd.to_numeric(df[month], errors='coerce')
    df['Year'] = pd.to_numeric(df['Year'], errors='coerce', downcast='integer')

    # Enhanced feature engineering
    def create_features(df_long):
        logger.info("Creating features...")
        
        # Create seasonal features
        logger.info("- Adding seasonal features")
        df_long['Month_Num'] = df_long['Month'].map({m: i+1 for i, m in enumerate(months)})
        df_long['Season'] = pd.cut(df_long['Month_Num'], 
                                  bins=[0, 3, 6, 9, 12], 
                                  labels=['Winter', 'Spring', 'Summer', 'Fall'])
        
        # Create price momentum features
        logger.info("- Adding price momentum features")
        df_long['Last_Year_Price'] = df_long.groupby(['Vegetable', 'Month'])['Price'].shift(1)
        df_long['Price_Change'] = df_long['Price'] - df_long['Last_Year_Price']
        
        # Create rolling statistics
        logger.info("- Adding rolling statistics")
        df_long['Rolling_Mean'] = df_long.groupby('Vegetable')['Price'].transform(
            lambda x: x.rolling(window=3, min_periods=1).mean())
        df_long['Rolling_Std'] = df_long.groupby('Vegetable')['Price'].transform(
            lambda x: x.rolling(window=3, min_periods=1).std())
        
        # Create interaction features
        logger.info("- Adding interaction features")
        df_long['Year_Month'] = df_long['Year'] * df_long['Month_Num']
        df_long['Price_Volatility'] = df_long['Rolling_Std'] / df_long['Rolling_Mean']
        
        return df_long

    # Reshape and prepare features
    logger.info("Reshaping data to long format...")
    df_long = df.melt(id_vars=['Year', 'Vegetable'], 
                      value_vars=months,
                      var_name='Month', 
                      value_name='Price')
    df_long = df_long.dropna(subset=['Price'])

    # Apply feature engineering
    df_long = create_features(df_long)
    df_long = df_long.dropna()  # Remove rows with NaN values after feature engineering
    logger.info(f"Data shape after feature engineering: {df_long.shape}")

    # Encode categorical variables
    logger.info("Encoding categorical variables...")
    label_encoder_veg = LabelEncoder()
    label_encoder_season = LabelEncoder()
    df_long['Vegetable'] = label_encoder_veg.fit_transform(df_long['Vegetable'])
    df_long['Season'] = label_encoder_season.fit_transform(df_long['Season'])

    # Prepare feature matrix and target vector
    feature_columns = ['Year', 'Vegetable', 'Month_Num', 'Season', 
                      'Last_Year_Price', 'Rolling_Mean', 'Rolling_Std',
                      'Price_Volatility', 'Year_Month']
    X = df_long[feature_columns]
    y = df_long['Price']

    logger.info(f"Final feature set: {feature_columns}")
    logger.info(f"Feature matrix shape: {X.shape}")

    # Split data with stratification
    logger.info("Splitting data into train and test sets...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42,
        stratify=pd.qcut(df_long['Price'], q=5, duplicates='drop').astype(str)
    )
    logger.info(f"Training set size: {X_train.shape[0]}, Test set size: {X_test.shape[0]}")

    # Define reduced parameter grids for faster execution
    logger.info("Defining parameter grids...")
    rf_params = {
        'n_estimators': [100, 200],
        'max_depth': [10, 15],
        'min_samples_split': [2, 5],
        'min_samples_leaf': [1, 2],
        'max_features': ['sqrt', 'log2']
    }

    gb_params = {
        'n_estimators': [100, 200],
        'learning_rate': [0.05, 0.1],
        'max_depth': [3, 5],
        'subsample': [0.8, 0.9],
        'min_samples_split': [2, 5],
        'min_samples_leaf': [1, 2]
    }

    et_params = {
        'n_estimators': [100, 200],
        'max_depth': [10, 15],
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
            verbose=2,  # Add verbosity to see progress
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
    # Rename grid variables to match string formatting
    random_forest_grid = rf_grid
    gradient_boosting_grid = gb_grid
    extra_trees_grid = et_grid
    
    results = pd.DataFrame([
        evaluate_model(random_forest_grid, 'Random Forest'),
        evaluate_model(gradient_boosting_grid, 'Gradient Boosting'),
        evaluate_model(extra_trees_grid, 'Extra Trees')
    ])

    # Print results
    logger.info("\nModel Performance Metrics:")
    logger.info("\n" + str(results.round(4)))

    # Print best parameters for the best model
    best_model_idx = results['R2'].idxmax()
    best_model_name = results.loc[best_model_idx, 'Model']
    best_model = locals()[best_model_name.lower().replace(' ', '_') + '_grid']

    logger.info(f"\nBest Model: {best_model_name}")
    logger.info("Best Parameters:")
    logger.info(best_model.best_params_)

    # Feature importance analysis for the best model
    def plot_feature_importance(model, feature_names):
        logger.info("Plotting feature importance...")
        if hasattr(model, 'feature_importances_'):
            importances = model.feature_importances_
            indices = np.argsort(importances)[::-1]
            
            plt.figure(figsize=(10, 6))
            plt.title('Feature Importances')
            plt.bar(range(X.shape[1]), importances[indices])
            plt.xticks(range(X.shape[1]), [feature_names[i] for i in indices], rotation=45)
            plt.tight_layout()
            plt.savefig('feature_importance.png')
            plt.close()

    # Get the best estimator and plot feature importance
    best_estimator = best_model.best_estimator_
    if best_model_name == 'Random Forest':
        plot_feature_importance(best_estimator.named_steps['rf'], feature_columns)
    elif best_model_name == 'Gradient Boosting':
        plot_feature_importance(best_estimator.named_steps['gb'], feature_columns)
    else:
        plot_feature_importance(best_estimator.named_steps['et'], feature_columns)

    # Save the best model
    logger.info("Saving best model...")
    import pickle
    with open('best_model_improved.pkl', 'wb') as f:
        pickle.dump(best_estimator, f)

    # Calculate total runtime
    total_time = time.time() - start_time
    logger.info(f"Total execution time: {total_time:.2f} seconds")

except Exception as e:
    logger.error(f"An error occurred: {str(e)}", exc_info=True)
    raise