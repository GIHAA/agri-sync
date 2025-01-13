from flask import Flask, request, jsonify
import pickle
import numpy as np
from collections import defaultdict

app = Flask(__name__)

# Load the trained model
with open('enhanced_price_prediction_model.pkl', 'rb') as f:
    model_artifacts = pickle.load(f)

model = model_artifacts['model']
label_encoders = model_artifacts['label_encoders']
feature_columns = model_artifacts['feature_columns']

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    # Extract the feature values from the request
    feature_values = [
        data['year'],
        label_encoders['item'].transform([data['item']])[0],
        label_encoders['district'].transform([data['district']])[0],
        label_encoders['month'].transform([data['month']])[0],
        data['temperature'],
        data['rain'],
        data['LP95'],
        data['LP92'],
        data['LAD'],
        data['LSD'],
        data['LK'],
        data['LIK'],
        np.sin(2 * np.pi * (data['month'] - 1) / 12),
        np.cos(2 * np.pi * (data['month'] - 1) / 12),
        data['price_rolling_mean'],
        data['price_rolling_std'],
        data['temperature'] * data['rain']
    ]

    # Create the feature matrix
    X = np.array([feature_values])

    # Make the prediction
    predicted_price = model.predict(X)[0]

    return jsonify({'predicted_price': predicted_price})

@app.route('/options', methods=['GET'])
def get_options():
    options = defaultdict(list)

    # Get unique values for each categorical feature
    for col, encoder in label_encoders.items():
        if col != 'year':
            options[col] = encoder.classes_.tolist()

    return jsonify(dict(options))

if __name__ == '__main__':
    app.run(debug=True)