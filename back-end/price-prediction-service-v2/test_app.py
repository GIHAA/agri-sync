# import pandas as pd
# import numpy as np
# from sklearn.model_selection import train_test_split
# from sklearn.preprocessing import MinMaxScaler, LabelEncoder
# import tensorflow as tf
# from tensorflow.keras.models import Sequential
# from tensorflow.keras.layers import LSTM, Dense, Dropout
# import xgboost as xgb
# from sklearn.metrics import mean_squared_error, r2_score
# import warnings
# warnings.filterwarnings('ignore')

# def load_and_preprocess_data():
#     """
#     Load and preprocess the price prediction dataset.
#     Returns: preprocessed dataframe and feature list
#     """
#     # Read CSV file
#     df = pd.read_csv('data.csv')
    
#     print("Initial data shape:", df.shape)
#     print("\nMissing values:\n", df.isnull().sum())
    
#     # Month mapping for abbreviated months
#     month_map = {
#         'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4,
#         'may': 5, 'jun': 6, 'jul': 7, 'aug': 8,
#         'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12
#     }
    
#     # Convert month to lowercase and map to numbers
#     df['month_num'] = df['month'].str.lower().map(month_map)
    
#     print("\nUnique months before mapping:", df['month'].unique())
#     print("Unique month numbers after mapping:", sorted(df['month_num'].unique()))
    
#     # Verify no missing values after month mapping
#     if df['month_num'].isnull().any():
#         raise ValueError("Month mapping failed for some values")
    
#     # Handle missing values in numeric columns
#     numeric_columns = ['temperature', 'rain', 'LP95', 'LP92', 'LAD', 'LSD', 'LK', 'LIK', 'price']
#     df[numeric_columns] = df[numeric_columns].fillna(df[numeric_columns].mean())
    
#     # Label encode categorical variables
#     le_item = LabelEncoder()
#     le_district = LabelEncoder()
    
#     df['item_encoded'] = le_item.fit_transform(df['item'])
#     df['district_encoded'] = le_district.fit_transform(df['district'])
    
#     # Create feature matrix
#     features = ['temperature', 'rain', 'LP95', 'LP92', 'LAD', 'LSD', 'LK', 'LIK',
#                'item_encoded', 'district_encoded', 'month_num']
    
#     # Scale features
#     scaler = MinMaxScaler()
#     df[features] = scaler.fit_transform(df[features])
    
#     print("\nFinal data shape:", df.shape)
#     print("Features used:", features)
    
#     # Verify no NaN values in features
#     if df[features].isnull().any().any():
#         raise ValueError("NaN values found in features after preprocessing")
    
#     return df, features

# def prepare_lstm_data(df, features, sequence_length=3):
#     """
#     Prepare sequences for LSTM model.
#     Returns: X sequences and y sequences
#     """
#     X = df[features].values
#     y = df[['price']].values
    
#     # Create sequences for LSTM
#     X_sequences = []
#     y_sequences = []
    
#     for i in range(len(X) - sequence_length):
#         X_sequences.append(X[i:(i + sequence_length)])
#         y_sequences.append(y[i + sequence_length])
    
#     X_sequences = np.array(X_sequences)
#     y_sequences = np.array(y_sequences)
    
#     print(f"\nSequence shapes - X: {X_sequences.shape}, y: {y_sequences.shape}")
    
#     return X_sequences, y_sequences

# def create_lstm_model(input_shape):
#     """
#     Create and compile LSTM model.
#     Returns: compiled LSTM model
#     """
#     model = Sequential([
#         LSTM(64, return_sequences=True, input_shape=input_shape),
#         Dropout(0.2),
#         LSTM(32),
#         Dropout(0.2),
#         Dense(16, activation='relu'),
#         Dense(1)
#     ])
    
#     model.compile(optimizer='adam', loss='mse', metrics=['mae'])
#     return model

# def train_lstm_model(X, y):
#     """
#     Train LSTM model with early stopping.
#     Returns: trained model and evaluation metrics
#     """
#     # Split the data
#     X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
#     # Create and train the model
#     model = create_lstm_model((X.shape[1], X.shape[2]))
    
#     # Add early stopping
#     early_stopping = tf.keras.callbacks.EarlyStopping(
#         monitor='val_loss',
#         patience=5,
#         restore_best_weights=True
#     )
    
#     # Train the model
#     history = model.fit(
#         X_train, y_train,
#         validation_split=0.2,
#         epochs=50,
#         batch_size=32,
#         callbacks=[early_stopping],
#         verbose=1
#     )
    
#     # Evaluate the model
#     y_pred = model.predict(X_test)
    
#     # Ensure no NaN values
#     if np.isnan(y_pred).any() or np.isnan(y_test).any():
#         raise ValueError("NaN values found in predictions or test data")
    
#     r2 = r2_score(y_test, y_pred)
#     rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    
#     return model, r2, rmse, y_test, y_pred

# def train_xgboost_model(df, features):
#     """
#     Train XGBoost model.
#     Returns: trained model and evaluation metrics
#     """
#     # Prepare data for XGBoost
#     X = df[features]
#     y = df['price']
    
#     # Split the data
#     X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
#     # Create and train the model
#     model = xgb.XGBRegressor(
#         n_estimators=2000,
#         learning_rate=0.01,
#         max_depth=6,
#         min_child_weight=1,
#         subsample=0.8,
#         colsample_bytree=0.8,
#         tree_method='hist',
#         random_state=42,
#         early_stopping_rounds=50
#     )
    
#     # Train the model
#     model.fit(
#         X_train, 
#         y_train,
#         eval_set=[(X_test, y_test)],
#         verbose=100
#     )
    
#     # Evaluate the model
#     y_pred = model.predict(X_test)
#     r2 = r2_score(y_test, y_pred)
#     rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    
#     # Print feature importance
#     importance_df = pd.DataFrame({
#         'feature': features,
#         'importance': model.feature_importances_
#     })
#     importance_df = importance_df.sort_values('importance', ascending=False)
#     print("\nFeature Importance:")
#     print(importance_df)
    
#     return model, r2, rmse, y_test, y_pred

# def save_models(lstm_model, xgb_model, filename_prefix='model'):
#     """
#     Save trained models to files.
#     """
#     try:
#         lstm_model.save(f'{filename_prefix}_lstm.h5')
#         xgb_model.save_model(f'{filename_prefix}_xgb.json')
#         print("Models saved successfully!")
#     except Exception as e:
#         print(f"Error saving models: {str(e)}")

# def main():
#     try:
#         # Load and preprocess data
#         print("Loading and preprocessing data...")
#         df, features = load_and_preprocess_data()
        
#         # Train LSTM model
#         print("\nTraining LSTM model...")
#         X_sequences, y_sequences = prepare_lstm_data(df, features)
#         lstm_model, lstm_r2, lstm_rmse, lstm_y_test, lstm_y_pred = train_lstm_model(X_sequences, y_sequences)
#         print(f"LSTM Model R² Score: {lstm_r2:.4f}")
#         print(f"LSTM Model RMSE: {lstm_rmse:.4f}")
        
#         # Train XGBoost model
#         print("\nTraining XGBoost model...")
#         xgb_model, xgb_r2, xgb_rmse, xgb_y_test, xgb_y_pred = train_xgboost_model(df, features)
#         print(f"\nXGBoost Model R² Score: {xgb_r2:.4f}")
#         print(f"XGBoost Model RMSE: {xgb_rmse:.4f}")
        
#         # Compare model predictions
#         print("\nModel Comparison:")
#         comparison_df = pd.DataFrame({
#             'Metric': ['R² Score', 'RMSE'],
#             'LSTM': [lstm_r2, lstm_rmse],
#             'XGBoost': [xgb_r2, xgb_rmse]
#         })
#         print(comparison_df)
        
#         # Optional: Save models
#         if input("\nDo you want to save the models? (y/n): ").lower() == 'y':
#             save_models(lstm_model, xgb_model)
        
#     except Exception as e:
#         print(f"An error occurred: {str(e)}")

# if __name__ == "__main__":
#     main()

