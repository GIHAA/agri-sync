import joblib
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import accuracy_score

# Load the pre-trained models
lr_model = joblib.load('lr_model.pkl')
xgb_model = joblib.load('xgb_model.pkl')
rf_model = joblib.load('rf_model.pkl')
scaler = joblib.load('scaler.pkl')

# Load the dataset
dataset = pd.read_csv('data/crop_recommendation_dataset.csv')

# Assuming the last column is the target variable (crop labels)
X = dataset.iloc[:, :-1]  # Features (all columns except the last)
y = dataset.iloc[:, -1]   # Target variable (crop labels)

# Dynamically create the label mapping
label_mapping = {idx: label for idx, label in enumerate(y.unique())}

# Function to evaluate models and return the best one
def evaluate_models(X, y):
    # Split the data into training and test sets
    from sklearn.model_selection import train_test_split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Logistic Regression
    y_pred_lr = lr_model.predict(X_test)
    accuracy_lr = accuracy_score(y_test, y_pred_lr)

    # XGBoost
    y_pred_xgb = xgb_model.predict(X_test)
    accuracy_xgb = accuracy_score(y_test, y_pred_xgb)

    # Random Forest
    y_pred_rf = rf_model.predict(X_test)
    accuracy_rf = accuracy_score(y_test, y_pred_rf)

    # Return the model with the highest accuracy
    accuracies = {
        'Logistic Regression': accuracy_lr,
        'XGBoost': accuracy_xgb,
        'Random Forest': accuracy_rf
    }

    best_model_name = max(accuracies, key=accuracies.get)
    best_model_accuracy = accuracies[best_model_name]

    # Return the best model
    if best_model_name == 'Logistic Regression':
        return lr_model
    elif best_model_name == 'XGBoost':
        return xgb_model
    else:
        return rf_model

# Flask API setup
app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    # Input features
    N = data.get('N')
    P = data.get('P')
    K = data.get('K')
    temperature = data.get('temperature')
    humidity = data.get('humidity')
    ph = data.get('ph')
    rainfall = data.get('rainfall')

    # Validate inputs
    if not all([N, P, K, temperature, humidity, ph, rainfall]):
        return jsonify({'error': 'All fields are required.'}), 400

    # Preprocess the input (normalize using the scaler)
    features = np.array([[N, P, K, temperature, humidity, ph, rainfall]])
    features_scaled = scaler.transform(features)

    # Evaluate models and select the best model
    best_model = evaluate_models(X, y)

    # Predict using the best model
    predicted_crop = best_model.predict(features_scaled)

    # Map the predicted label back to the crop name using the dynamic label mapping
    predicted_crop_label = label_mapping.get(predicted_crop[0], "unknown")  # Default to "unknown" if not found

    return jsonify({'predicted_crop': predicted_crop_label})


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'OK'})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3008)
