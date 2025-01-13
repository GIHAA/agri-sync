# import pandas as pd
# import numpy as np
# from sklearn.model_selection import train_test_split
# from sklearn.preprocessing import LabelEncoder, StandardScaler
# from sklearn.metrics import mean_squared_error, r2_score
# import matplotlib.pyplot as plt
# from sklearn.linear_model import LinearRegression
# from sklearn.tree import DecisionTreeRegressor
# from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
# from sklearn.svm import SVR
# from sklearn.neighbors import KNeighborsRegressor
# from xgboost import XGBRegressor
# import pickle

# # Load the data
# df = pd.read_csv('Price_Prediction(1).csv')

# # Convert categorical variables
# label_encoders = {}
# categorical_columns = ['item', 'district', 'month']
# for col in categorical_columns:
#     label_encoders[col] = LabelEncoder()
#     df[col] = label_encoders[col].fit_transform(df[col])

# # Prepare feature matrix and target vector
# X = df[['year', 'item', 'district', 'month', 'temperature', 'rain', 
#         'LP95', 'LP92', 'LAD', 'LSD', 'LK', 'LIK']]  # Features
# y = df['price']  # Target

# # Scale the features
# scaler = StandardScaler()
# X_scaled = scaler.fit_transform(X)

# # Split data into train and test sets
# X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# # Define models to compare
# models = {
#     "Linear Regression": LinearRegression(),
#     "Decision Tree": DecisionTreeRegressor(random_state=42),
#     "Random Forest": RandomForestRegressor(random_state=42),
#     "Support Vector Regressor": SVR(kernel='rbf'),
#     "K-Nearest Neighbors": KNeighborsRegressor(),
#     "Gradient Boosting": GradientBoostingRegressor(random_state=42),
#     "XGBoost": XGBRegressor(random_state=42)
# }

# # Store results for comparison
# results = {}

# # Train and evaluate each model
# for model_name, model in models.items():
#     print(f"\nTraining {model_name}...")
#     model.fit(X_train, y_train)
#     y_pred = model.predict(X_test)
    
#     # Calculate metrics
#     mse = mean_squared_error(y_test, y_pred)
#     rmse = np.sqrt(mse)
#     r2 = r2_score(y_test, y_pred)
    
#     results[model_name] = {
#         'RMSE': rmse,
#         'R2': r2
#     }
    
#     print(f"{model_name} - RMSE: {rmse:.2f}, R2: {r2:.4f}")

# # Create results DataFrame
# results_df = pd.DataFrame(results).T
# print("\nModel Comparison:")
# print(results_df)

# # Visualize the results
# plt.figure(figsize=(12, 6))

# # Plot RMSE
# plt.subplot(1, 2, 1)
# results_df['RMSE'].plot(kind='bar')
# plt.title('RMSE by Model')
# plt.xticks(rotation=45)
# plt.tight_layout()

# # Plot R2
# plt.subplot(1, 2, 2)
# results_df['R2'].plot(kind='bar')
# plt.title('R² Score by Model')
# plt.xticks(rotation=45)
# plt.tight_layout()

# plt.show()

# # Find the best model based on R2 score
# best_model_name = results_df['R2'].idxmax()
# best_model = models[best_model_name]
# print(f"\nBest performing model: {best_model_name}")
# print(f"R² score: {results_df.loc[best_model_name, 'R2']:.4f}")
# print(f"RMSE: {results_df.loc[best_model_name, 'RMSE']:.2f}")

# # Save the best model and preprocessing objects
# model_artifacts = {
#     'model': best_model,
#     'scaler': scaler,
#     'label_encoders': label_encoders,
#     'feature_columns': X.columns.tolist()
# }

# with open('price_prediction_model.pkl', 'wb') as f:
#     pickle.dump(model_artifacts, f)

# print("\nModel saved as 'price_prediction_model.pkl'")

# # Feature importance for tree-based models
# if hasattr(best_model, 'feature_importances_'):
#     feature_importance = pd.DataFrame({
#         'feature': X.columns,
#         'importance': best_model.feature_importances_
#     }).sort_values('importance', ascending=False)
    
#     print("\nFeature Importance:")
#     print(feature_importance)




#  worked -  0.9 

# import pandas as pd
# import numpy as np
# from sklearn.model_selection import train_test_split, GridSearchCV, TimeSeriesSplit
# from sklearn.preprocessing import LabelEncoder
# from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
# from sklearn.ensemble import HistGradientBoostingRegressor, RandomForestRegressor
# from xgboost import XGBRegressor
# import matplotlib.pyplot as plt
# import seaborn as sns
# import pickle
# from sklearn.impute import SimpleImputer

# # Load the data
# df = pd.read_csv('Price_Prediction(1).csv')

# # Handle missing values
# imputer = SimpleImputer(strategy='mean')
# df[['temperature', 'rain', 'LP95', 'LP92', 'LAD', 'LSD', 'LK', 'LIK']] = imputer.fit_transform(df[['temperature', 'rain', 'LP95', 'LP92', 'LAD', 'LSD', 'LK', 'LIK']])

# # Convert month to numeric
# month_mapping = {'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'may': 5, 'jun': 6, 'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12}
# df['month'] = df['month'].apply(lambda x: month_mapping.get(str(x).lower(), x))

# # Create cyclical features for month
# df['month_sin'] = df['month'].apply(lambda x: np.sin(2 * np.pi * (x - 1) / 12))
# df['month_cos'] = df['month'].apply(lambda x: np.cos(2 * np.pi * (x - 1) / 12))

# # Create rolling statistics for price (grouped by item and district)
# df['price_rolling_mean'] = df.groupby(['item', 'district'])['price'].transform(
#     lambda x: x.rolling(window=3, min_periods=1).mean()
# )
# df['price_rolling_std'] = df.groupby(['item', 'district'])['price'].transform(
#     lambda x: x.rolling(window=3, min_periods=1).std()
# )

# # Add interaction between temperature and rain
# df['temp_rain_interaction'] = df['temperature'] * df['rain']

# # Handle outliers using IQR method
# def remove_outliers(df, column):
#     Q1 = df[column].quantile(0.25)
#     Q3 = df[column].quantile(0.75)
#     IQR = Q3 - Q1
#     return df[~((df[column] < (Q1 - 1.5 * IQR)) | (df[column] > (Q3 + 1.5 * IQR)))]

# df = remove_outliers(df, 'price')

# # Convert categorical variables
# label_encoders = {}
# categorical_columns = ['item', 'district', 'month']
# for col in categorical_columns:
#     label_encoders[col] = LabelEncoder()
#     df[col] = label_encoders[col].fit_transform(df[col])

# # Prepare feature matrix and target vector
# feature_columns = ['year', 'item', 'district', 'month', 'temperature', 'rain', 
#                   'LP95', 'LP92', 'LAD', 'LSD', 'LK', 'LIK',
#                   'month_sin', 'month_cos', 'price_rolling_mean', 
#                   'price_rolling_std', 'temp_rain_interaction']

# X = df[feature_columns]
# y = df['price']

# # Split data into train and test sets
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# # Define models to compare
# models = {
#     "HistGradientBoosting": HistGradientBoostingRegressor(random_state=42),
#     "Random Forest": RandomForestRegressor(random_state=42),
#     "XGBoost": XGBRegressor(
#         random_state=42,
#         reg_alpha=0.1,  # L1 regularization
#         reg_lambda=1.0  # L2 regularization
#     )
# }

# # Hyperparameter tuning for HistGradientBoosting
# hgb_param_grid = {
#     'max_depth': [3, 4, 5],
#     'learning_rate': [0.01, 0.1],
#     'min_samples_leaf': [5, 10, 20]
# }

# grid_search = GridSearchCV(
#     HistGradientBoostingRegressor(random_state=42),
#     hgb_param_grid,
#     cv=5,
#     scoring='r2',
#     n_jobs=-1
# )

# print("Performing Grid Search for HistGradientBoosting...")
# grid_search.fit(X_train, y_train)
# print("Best parameters:", grid_search.best_params_)
# models["HistGradientBoosting (Tuned)"] = grid_search.best_estimator_

# # Store results for comparison
# results = {}

# # Time series cross-validation
# tscv = TimeSeriesSplit(n_splits=5)

# # Train and evaluate each model
# for model_name, model in models.items():
#     print(f"\nTraining {model_name}...")
#     model.fit(X_train, y_train)
#     y_pred = model.predict(X_test)
    
#     # Calculate metrics
#     mse = mean_squared_error(y_test, y_pred)
#     rmse = np.sqrt(mse)
#     r2 = r2_score(y_test, y_pred)
#     mae = mean_absolute_error(y_test, y_pred)
    
#     # Calculate cross-validation scores
#     cv_scores = []
#     for train_idx, val_idx in tscv.split(X):
#         X_train_cv, X_val_cv = X.iloc[train_idx], X.iloc[val_idx]
#         y_train_cv, y_val_cv = y.iloc[train_idx], y.iloc[val_idx]
        
#         model.fit(X_train_cv, y_train_cv)
#         cv_pred = model.predict(X_val_cv)
#         cv_scores.append(r2_score(y_val_cv, cv_pred))
    
#     results[model_name] = {
#         'RMSE': rmse,
#         'R2': r2,
#         'MAE': mae,
#         'CV_R2_mean': np.mean(cv_scores),
#         'CV_R2_std': np.std(cv_scores)
#     }
    
#     print(f"{model_name} Results:")
#     print(f"RMSE: {rmse:.2f}")
#     print(f"R2: {r2:.4f}")
#     print(f"MAE: {mae:.2f}")
#     print(f"CV R2 (mean ± std): {np.mean(cv_scores):.4f} ± {np.std(cv_scores):.4f}")

# # Create results DataFrame
# results_df = pd.DataFrame(results).T
# print("\nModel Comparison:")
# print(results_df)

# # Visualize the results
# plt.figure(figsize=(15, 10))

# # Plot RMSE
# plt.subplot(2, 2, 1)
# results_df['RMSE'].plot(kind='bar')
# plt.title('RMSE by Model')
# plt.xticks(rotation=45)

# # Plot R2
# plt.subplot(2, 2, 2)
# results_df['R2'].plot(kind='bar')
# plt.title('R² Score by Model')
# plt.xticks(rotation=45)

# # Plot MAE
# plt.subplot(2, 2, 3)
# results_df['MAE'].plot(kind='bar')
# plt.title('MAE by Model')
# plt.xticks(rotation=45)

# # Plot CV R2
# plt.subplot(2, 2, 4)
# plt.errorbar(range(len(results_df)), 
#              results_df['CV_R2_mean'],
#              yerr=results_df['CV_R2_std'],
#              fmt='o')
# plt.xticks(range(len(results_df)), results_df.index, rotation=45)
# plt.title('Cross-validation R² Score (mean ± std)')

# plt.tight_layout()
# plt.show()

# # Find the best model based on CV R2 score
# best_model_name = results_df['CV_R2_mean'].idxmax()
# best_model = models[best_model_name]
# print(f"\nBest performing model: {best_model_name}")
# print(f"CV R² score: {results_df.loc[best_model_name, 'CV_R2_mean']:.4f} ± {results_df.loc[best_model_name, 'CV_R2_std']:.4f}")
# print(f"Test R² score: {results_df.loc[best_model_name, 'R2']:.4f}")
# print(f"RMSE: {results_df.loc[best_model_name, 'RMSE']:.2f}")
# print(f"MAE: {results_df.loc[best_model_name, 'MAE']:.2f}")

# # Feature importance analysis
# if hasattr(best_model, 'feature_importances_'):
#     feature_names = feature_columns
#     if isinstance(X, pd.DataFrame):
#         feature_names = X.columns
    
#     feature_importance = pd.DataFrame({
#         'feature': feature_names,
#         'importance': best_model.feature_importances_
#     }).sort_values('importance', ascending=False)
    
#     print("\nTop 10 Feature Importance:")
#     print(feature_importance.head(10))

#     # Visualize feature importance
#     plt.figure(figsize=(10, 6))
#     sns.barplot(x='importance', y='feature', data=feature_importance.head(10))
#     plt.title('Top 10 Feature Importance')
#     plt.tight_layout()
#     plt.show()

# # Save the best model and preprocessing objects
# model_artifacts = {
#     'model': best_model,
#     'label_encoders': label_encoders,
#     'feature_columns': feature_columns
# }

# with open('enhanced_price_prediction_model.pkl', 'wb') as f:
#     pickle.dump(model_artifacts, f)

# print("\nEnhanced model saved as 'enhanced_price_prediction_model.pkl'")

# # Error Analysis
# predictions = best_model.predict(X_test)
# errors = abs(predictions - y_test)

# error_analysis = pd.DataFrame({
#     'actual': y_test,
#     'predicted': predictions,
#     'error': errors,
#     'item': label_encoders['item'].inverse_transform(X_train[:len(y_test), 1])
# })

# print("\nError Analysis by Item:")
# error_stats = error_analysis.groupby('item').agg({
#     'error': ['mean', 'std', 'count']
# }).sort_values(('error', 'mean'), ascending=False)
# print(error_stats)

# # Visualize prediction errors
# plt.figure(figsize=(10, 6))
# plt.scatter(predictions, y_test, alpha=0.5)
# plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
# plt.xlabel('Predicted Price')
# plt.ylabel('Actual Price')
# plt.title('Predicted vs Actual Prices')
# plt.tight_layout()
# plt.show()

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV, TimeSeriesSplit
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.ensemble import HistGradientBoostingRegressor, RandomForestRegressor
from xgboost import XGBRegressor
import matplotlib.pyplot as plt
import seaborn as sns
import pickle
from sklearn.impute import SimpleImputer

# Load the data
df = pd.read_csv('Price_Prediction(1).csv')

# Handle missing values
imputer = SimpleImputer(strategy='mean')
df[['temperature', 'rain', 'LP95', 'LP92', 'LAD', 'LSD', 'LK', 'LIK']] = imputer.fit_transform(df[['temperature', 'rain', 'LP95', 'LP92', 'LAD', 'LSD', 'LK', 'LIK']])

# Convert month to numeric
month_mapping = {'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'may': 5, 'jun': 6, 'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12}
df['month'] = df['month'].apply(lambda x: month_mapping.get(str(x).lower(), x))

# Create cyclical features for month
df['month_sin'] = df['month'].apply(lambda x: np.sin(2 * np.pi * (x - 1) / 12))
df['month_cos'] = df['month'].apply(lambda x: np.cos(2 * np.pi * (x - 1) / 12))

# Create rolling statistics for price (grouped by item and district)
df['price_rolling_mean'] = df.groupby(['item', 'district'])['price'].transform(
    lambda x: x.rolling(window=3, min_periods=1).mean()
)
df['price_rolling_std'] = df.groupby(['item', 'district'])['price'].transform(
    lambda x: x.rolling(window=3, min_periods=1).std()
)

# Add interaction between temperature and rain
df['temp_rain_interaction'] = df['temperature'] * df['rain']

# Handle outliers using IQR method
def remove_outliers(df, column):
    Q1 = df[column].quantile(0.25)
    Q3 = df[column].quantile(0.75)
    IQR = Q3 - Q1
    return df[~((df[column] < (Q1 - 1.5 * IQR)) | (df[column] > (Q3 + 1.5 * IQR)))]

df = remove_outliers(df, 'price')

# Convert categorical variables
label_encoders = {}
categorical_columns = ['item', 'district', 'month']
for col in categorical_columns:
    label_encoders[col] = LabelEncoder()
    df[col] = label_encoders[col].fit_transform(df[col])

# Prepare feature matrix and target vector
feature_columns = ['year', 'item', 'district', 'month', 'temperature', 'rain', 
                  'LP95', 'LP92', 'LAD', 'LSD', 'LK', 'LIK',
                  'month_sin', 'month_cos', 'price_rolling_mean', 
                  'price_rolling_std', 'temp_rain_interaction']

X = df[feature_columns]
y = df['price']

# Split data into train and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Define models to compare
models = {
    "HistGradientBoosting": HistGradientBoostingRegressor(random_state=42),
    "Random Forest": RandomForestRegressor(random_state=42),
    "XGBoost": XGBRegressor(
        random_state=42,
        reg_alpha=0.1,  # L1 regularization
        reg_lambda=1.0  # L2 regularization
    )
}

# Hyperparameter tuning for HistGradientBoosting
hgb_param_grid = {
    'max_depth': [3, 4, 5],
    'learning_rate': [0.01, 0.1],
    'min_samples_leaf': [5, 10, 20]
}

grid_search = GridSearchCV(
    HistGradientBoostingRegressor(random_state=42),
    hgb_param_grid,
    cv=5,
    scoring='r2',
    n_jobs=-1
)

print("Performing Grid Search for HistGradientBoosting...")
grid_search.fit(X_train, y_train)
print("Best parameters:", grid_search.best_params_)
models["HistGradientBoosting (Tuned)"] = grid_search.best_estimator_

# Store results for comparison
results = {}

# Time series cross-validation
tscv = TimeSeriesSplit(n_splits=5)

# Train and evaluate each model
for model_name, model in models.items():
    print(f"\nTraining {model_name}...")
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    
    # Calculate metrics
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    
    # Calculate cross-validation scores
    cv_scores = []
    for train_idx, val_idx in tscv.split(X):
        X_train_cv, X_val_cv = X.iloc[train_idx], X.iloc[val_idx]
        y_train_cv, y_val_cv = y.iloc[train_idx], y.iloc[val_idx]
        
        model.fit(X_train_cv, y_train_cv)
        cv_pred = model.predict(X_val_cv)
        cv_scores.append(r2_score(y_val_cv, cv_pred))
    
    results[model_name] = {
        'RMSE': rmse,
        'R2': r2,
        'MAE': mae,
        'CV_R2_mean': np.mean(cv_scores),
        'CV_R2_std': np.std(cv_scores)
    }
    
    print(f"{model_name} Results:")
    print(f"RMSE: {rmse:.2f}")
    print(f"R2: {r2:.4f}")
    print(f"MAE: {mae:.2f}")
    print(f"CV R2 (mean ± std): {np.mean(cv_scores):.4f} ± {np.std(cv_scores):.4f}")

# Create results DataFrame
results_df = pd.DataFrame(results).T
print("\nModel Comparison:")
print(results_df)

# Visualize the results
plt.figure(figsize=(15, 10))

# Plot RMSE
plt.subplot(2, 2, 1)
results_df['RMSE'].plot(kind='bar')
plt.title('RMSE by Model')
plt.xticks(rotation=45)

# Plot R2
plt.subplot(2, 2, 2)
results_df['R2'].plot(kind='bar')
plt.title('R² Score by Model')
plt.xticks(rotation=45)

# Plot MAE
plt.subplot(2, 2, 3)
results_df['MAE'].plot(kind='bar')
plt.title('MAE by Model')
plt.xticks(rotation=45)

# Plot CV R2
plt.subplot(2, 2, 4)
plt.errorbar(range(len(results_df)), 
             results_df['CV_R2_mean'],
             yerr=results_df['CV_R2_std'],
             fmt='o')
plt.xticks(range(len(results_df)), results_df.index, rotation=45)
plt.title('Cross-validation R² Score (mean ± std)')

plt.tight_layout()
plt.show()

# Find the best model based on CV R2 score
best_model_name = results_df['CV_R2_mean'].idxmax()
best_model = models[best_model_name]
print(f"\nBest performing model: {best_model_name}")
print(f"CV R² score: {results_df.loc[best_model_name, 'CV_R2_mean']:.4f} ± {results_df.loc[best_model_name, 'CV_R2_std']:.4f}")
print(f"Test R² score: {results_df.loc[best_model_name, 'R2']:.4f}")
print(f"RMSE: {results_df.loc[best_model_name, 'RMSE']:.2f}")
print(f"MAE: {results_df.loc[best_model_name, 'MAE']:.2f}")

# Feature importance analysis
if hasattr(best_model, 'feature_importances_'):
    feature_names = feature_columns
    if isinstance(X, pd.DataFrame):
        feature_names = X.columns
    
    feature_importance = pd.DataFrame({
        'feature': feature_names,
        'importance': best_model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\nTop 10 Feature Importance:")
    print(feature_importance.head(10))

    # Visualize feature importance
    plt.figure(figsize=(10, 6))
    sns.barplot(x='importance', y='feature', data=feature_importance.head(10))
    plt.title('Top 10 Feature Importance')
    plt.tight_layout()
    plt.show()

# Save the best model and preprocessing objects
model_artifacts = {
    'model': best_model,
    'label_encoders': label_encoders,
    'feature_columns': feature_columns
}

with open('enhanced_price_prediction_model.pkl', 'wb') as f:
    pickle.dump(model_artifacts, f)

print("\nEnhanced model saved as 'enhanced_price_prediction_model.pkl'")

# Error Analysis
predictions = best_model.predict(X_test)
errors = abs(predictions - y_test)

error_analysis = pd.DataFrame({
    'actual': y_test,
    'predicted': predictions,
    'error': errors,
    'item': [label_encoders['item'].inverse_transform([x])[0] for x in X_test[:, 1]]
})

print("\nError Analysis by Item:")
error_stats = error_analysis.groupby('item').agg({
    'error': ['mean', 'std', 'count']
}).sort_values(('error', 'mean'), ascending=False)
print(error_stats)

# Visualize prediction errors
plt.figure(figsize=(10, 6))
plt.scatter(predictions, y_test, alpha=0.5)
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
plt.xlabel('Predicted Price')
plt.ylabel('Actual Price')
plt.title('Predicted vs Actual Prices')
plt.tight_layout()
plt.show()