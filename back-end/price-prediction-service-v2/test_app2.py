import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler, LabelEncoder
import tensorflow as tf
from tensorflow.keras.models import load_model
import xgboost as xgb
from sklearn.metrics import mean_squared_error, r2_score

def load_and_preprocess_data():
    """
    Load and preprocess the data using the same steps as training
    """
    df = pd.read_csv('data.csv')
    
    # Print dataset statistics
    print("\nDataset Statistics:")
    print(f"Total records: {len(df)}")
    print("\nRecords per vegetable:")
    print(df['item'].value_counts())
    
    # Month mapping
    month_map = {
        'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4,
        'may': 5, 'jun': 6, 'jul': 7, 'aug': 8,
        'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12
    }
    
    df['month_num'] = df['month'].str.lower().map(month_map)
    
    # Handle missing values in numeric columns
    numeric_columns = ['temperature', 'rain', 'LP95', 'LP92', 'LAD', 'LSD', 'LK', 'LIK', 'price']
    df[numeric_columns] = df[numeric_columns].fillna(df[numeric_columns].mean())
    
    # Label encode categorical variables
    le_item = LabelEncoder()
    le_district = LabelEncoder()
    
    df['item_encoded'] = le_item.fit_transform(df['item'])
    df['district_encoded'] = le_district.fit_transform(df['district'])
    
    # Store item mapping for later use
    item_mapping = dict(zip(le_item.transform(le_item.classes_), le_item.classes_))
    
    # Features for models
    features = ['temperature', 'rain', 'LP95', 'LP92', 'LAD', 'LSD', 'LK', 'LIK',
               'item_encoded', 'district_encoded', 'month_num']
    
    # Scale features
    scaler = MinMaxScaler()
    df[features] = scaler.fit_transform(df[features])
    
    return df, features, item_mapping

def prepare_lstm_sequence(data, features, sequence_length=3):
    """
    Prepare sequences for LSTM prediction
    """
    X = data[features].values
    y = data[['price']].values
    
    X_sequences = []
    y_sequences = []
    
    for i in range(len(X) - sequence_length):
        X_sequences.append(X[i:(i + sequence_length)])
        y_sequences.append(y[i + sequence_length])
    
    return np.array(X_sequences), np.array(y_sequences)

def load_lstm_model(model_path):
    """
    Load and recompile LSTM model
    """
    model = load_model(model_path, compile=False)
    model.compile(optimizer='adam', loss='mse', metrics=['mae'])
    return model

def evaluate_models_by_vegetable():
    # Load data
    df, features, item_mapping = load_and_preprocess_data()
    
    print("\nLoading models...")
    lstm_model = load_lstm_model('model_lstm.h5')
    xgb_model = xgb.XGBRegressor()
    xgb_model.load_model('model_xgb.json')
    
    # Store results
    results = []
    
    # Set minimum records required for evaluation
    min_records = 10
    
    print(f"\nEvaluating vegetables with at least {min_records} records...")
    # Evaluate for each vegetable
    for item_code in item_mapping.keys():
        item_name = item_mapping[item_code]
        item_data = df[df['item_encoded'] == item_code]
        
        if len(item_data) >= min_records:
            try:
                # LSTM evaluation
                X_sequences, y_sequences = prepare_lstm_sequence(item_data, features)
                if len(X_sequences) > 0:
                    lstm_pred = lstm_model.predict(X_sequences, verbose=0)
                    lstm_r2 = r2_score(y_sequences, lstm_pred)
                    lstm_rmse = np.sqrt(mean_squared_error(y_sequences, lstm_pred))
                else:
                    lstm_r2 = np.nan
                    lstm_rmse = np.nan
                
                # XGBoost evaluation
                X_xgb = item_data[features]
                y_xgb = item_data['price']
                xgb_pred = xgb_model.predict(X_xgb)
                xgb_r2 = r2_score(y_xgb, xgb_pred)
                xgb_rmse = np.sqrt(mean_squared_error(y_xgb, xgb_pred))
                
                results.append({
                    'Vegetable': item_name,
                    'Records': len(item_data),
                    'LSTM_R2': lstm_r2,
                    'LSTM_RMSE': lstm_rmse,
                    'XGB_R2': xgb_r2,
                    'XGB_RMSE': xgb_rmse
                })
                print(f"Processed {item_name} ({len(item_data)} records)")
            except Exception as e:
                print(f"Error processing {item_name}: {str(e)}")
        else:
            print(f"Skipping {item_name} - insufficient records ({len(item_data)} < {min_records})")
    
    # Convert to DataFrame and sort by XGB_R2 (best performing model)
    results_df = pd.DataFrame(results)
    if not results_df.empty:
        results_df = results_df.sort_values('XGB_R2', ascending=False)
        
        # Round numeric columns
        numeric_cols = ['LSTM_R2', 'LSTM_RMSE', 'XGB_R2', 'XGB_RMSE']
        results_df[numeric_cols] = results_df[numeric_cols].round(4)
    
    return results_df

def main():
    try:
        print("Evaluating models for each vegetable...")
        results = evaluate_models_by_vegetable()
        
        if results.empty:
            print("No results generated. Check if the models are loaded correctly.")
            return
            
        print("\nModel Performance by Vegetable:")
        pd.set_option('display.max_rows', None)  # Show all rows
        print(results.to_string(index=False))
        
        # Save results to CSV
        results.to_csv('model_evaluation_results.csv', index=False)
        print("\nResults saved to 'model_evaluation_results.csv'")
        
        # Print summary statistics
        print("\nSummary Statistics:")
        print("\nAverage Performance (excluding negative R² scores):")
        print(f"LSTM - R² Score: {results[results['LSTM_R2'] > 0]['LSTM_R2'].mean():.4f}, RMSE: {results['LSTM_RMSE'].mean():.4f}")
        print(f"XGBoost - R² Score: {results[results['XGB_R2'] > 0]['XGB_R2'].mean():.4f}, RMSE: {results['XGB_RMSE'].mean():.4f}")
        
        print("\nBest Performing Vegetables:")
        print("\nXGBoost Top 3:")
        print(results[results['XGB_R2'] > 0][['Vegetable', 'XGB_R2', 'XGB_RMSE']].head(3))
        
        print("\nLSTM Top 3:")
        print(results[results['LSTM_R2'] > 0].nlargest(3, 'LSTM_R2')[['Vegetable', 'LSTM_R2', 'LSTM_RMSE']])
        
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        import traceback
        print(traceback.format_exc())

if __name__ == "__main__":
    main()