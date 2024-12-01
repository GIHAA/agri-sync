import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import pickle
import logging

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,  # Log all levels (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("app.log"),  # Log to a file
        logging.StreamHandler()         # Log to console
    ]
)

# Load and preprocess the data
logging.info("Loading data from Excel file.")
try:
    df = pd.read_excel("data.xlsx", sheet_name="Sheet2", skiprows=2)
except Exception as e:
    logging.error(f"Failed to load data: {str(e)}")
    raise

df.columns = ['Index', 'Year', 'Vegetable', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
df = df.drop(columns=['Index'])
df = df[df['Year'] != 'Year']
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

# Ensure data types
logging.info("Ensuring correct data types for months and year.")
for month in months:
    df[month] = pd.to_numeric(df[month], errors='coerce')
df['Year'] = pd.to_numeric(df['Year'], errors='coerce', downcast='integer')

# Reshape the data to long format
logging.info("Reshaping data to long format.")
df_long = df.melt(id_vars=['Year', 'Vegetable'], value_vars=months, var_name='Month', value_name='Price')
df_long = df_long.dropna(subset=['Price'])

# Encode categorical data
logging.info("Encoding categorical data for vegetables and months.")
label_encoder_veg = LabelEncoder()
label_encoder_month = LabelEncoder()
df_long['Vegetable'] = label_encoder_veg.fit_transform(df_long['Vegetable'])
df_long['Month'] = label_encoder_month.fit_transform(df_long['Month'])

# Split data into features and target
X = df_long[['Year', 'Month', 'Vegetable']]
y = df_long['Price']

# Split into training and testing sets
logging.info("Splitting data into training and testing sets.")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train a Random Forest Regressor
logging.info("Training the Random Forest Regressor model.")
model = RandomForestRegressor(random_state=42)
model.fit(X_train, y_train)

# Save the trained model and label encoders
logging.info("Saving the trained model and label encoders.")
pickle.dump(model, open("price_model.pkl", "wb"))
pickle.dump(label_encoder_veg, open("label_encoder_veg.pkl", "wb"))
pickle.dump(label_encoder_month, open("label_encoder_month.pkl", "wb"))

# Flask API
app = Flask(__name__)

# Enable CORS
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    logging.info("Received prediction request.")
    data = request.get_json()
    logging.debug(f"Request data: {data}")
    
    # Extract year and month from `whenToPlant`
    when_to_plant = data.get("whenToPlant", "")
    try:
        date = pd.to_datetime(when_to_plant)
        year = date.year
        month = date.strftime('%b')
    except Exception as e:
        logging.error(f"Invalid 'whenToPlant' format: {str(e)}")
        return jsonify({'data': None, 'message': f"Invalid 'whenToPlant' format: {str(e)}", 'success': False}), 400

    vegetable = data.get("whatToPlant", "").upper()
    if not vegetable:
        logging.error("'whatToPlant' is missing from the request.")
        return jsonify({'data': None, 'message': "'whatToPlant' is required.", 'success': False}), 400

    try:
        model = pickle.load(open("price_model.pkl", "rb"))
        label_encoder_veg = pickle.load(open("label_encoder_veg.pkl", "rb"))
        label_encoder_month = pickle.load(open("label_encoder_month.pkl", "rb"))
        
        month_encoded = label_encoder_month.transform([month])[0]
        vegetable_encoded = label_encoder_veg.transform([vegetable])[0]
    except ValueError as e:
        logging.error(f"Encoding error: {str(e)}")
        return jsonify({'data': None, 'message': f"Invalid input: {str(e)}", 'success': False}), 400

    prediction = model.predict([[year, month_encoded, vegetable_encoded]])
    logging.info(f"Prediction completed. Predicted price: {prediction[0]}")
    return jsonify({'data': {'predicted_price': prediction[0]}, 'message': "Prediction successful.", 'success': True})


@app.route('/options', methods=['GET'])
def get_options():
    logging.info("Received request for options.")
    try:
        df = pd.read_excel("data.xlsx", sheet_name="Sheet2", skiprows=2)
        df.columns = ['Index', 'Year', 'Vegetable', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        df = df.drop(columns=['Index'])
        df = df[df['Year'] != 'Year']
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

        years = sorted(df['Year'].dropna().unique())
        vegetables = sorted(df['Vegetable'].dropna().unique())
        months = sorted(months)
        logging.info("Options retrieved successfully.")
        return jsonify({
            'data': {
                'years': years,
                'months': months,
                'vegetables': vegetables
            },
            'message': "Options retrieved successfully.",
            'success': True
        })
    except Exception as e:
        logging.error(f"Error retrieving options: {str(e)}")
        return jsonify({'data': None, 'message': f"Error retrieving options: {str(e)}", 'success': False}), 500



if __name__ == '__main__':
    logging.info("Starting Flask app.")
    app.run(host='0.0.0.0', port=3001) 


# flask run --host=0.0.0.0 --port=3000


