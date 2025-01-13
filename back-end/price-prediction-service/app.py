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



# import pandas as pd
# from flask import Flask, request, jsonify
# from sklearn.model_selection import train_test_split, cross_val_score
# from sklearn.ensemble import RandomForestRegressor
# from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
# from sklearn.preprocessing import LabelEncoder
# import pickle
# import numpy as np
# import matplotlib.pyplot as plt

# # Step 1: Load and preprocess the data
# df = pd.read_excel("data.xlsx", sheet_name="Sheet2", skiprows=2)
# df.columns = ['Index', 'Year', 'Vegetable', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
#               'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
# df = df.drop(columns=['Index'])
# df = df[df['Year'] != 'Year']
# months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

# # Ensure data types
# for month in months:
#     df[month] = pd.to_numeric(df[month], errors='coerce')
# df['Year'] = pd.to_numeric(df['Year'], errors='coerce', downcast='integer')

# # Reshape the data to long format
# df_long = df.melt(id_vars=['Year', 'Vegetable'], value_vars=months, var_name='Month', value_name='Price')
# df_long = df_long.dropna(subset=['Price'])

# # Encode categorical data
# label_encoder_veg = LabelEncoder()
# label_encoder_month = LabelEncoder()
# df_long['Vegetable'] = label_encoder_veg.fit_transform(df_long['Vegetable'])
# df_long['Month'] = label_encoder_month.fit_transform(df_long['Month'])

# # Split data into features and target
# X = df_long[['Year', 'Month', 'Vegetable']]
# y = df_long['Price']

# # Split into training and testing sets
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# # Step 2: Train the model
# model = RandomForestRegressor(random_state=42)
# model.fit(X_train, y_train)

# # Save the trained model and encoders
# pickle.dump(model, open("price_model.pkl", "wb"))
# pickle.dump(label_encoder_veg, open("label_encoder_veg.pkl", "wb"))
# pickle.dump(label_encoder_month, open("label_encoder_month.pkl", "wb"))

# # Step 3: Evaluate the model
# y_pred = model.predict(X_test)
# mae = mean_absolute_error(y_test, y_pred)
# mse = mean_squared_error(y_test, y_pred)
# rmse = np.sqrt(mse)
# r2 = r2_score(y_test, y_pred)

# print(f"Mean Absolute Error (MAE): {mae}")
# print(f"Mean Squared Error (MSE): {mse}")
# print(f"Root Mean Squared Error (RMSE): {rmse}")
# print(f"R-squared (R2): {r2}")

# # Cross-validation
# cv_scores = cross_val_score(model, X, y, cv=5, scoring='neg_mean_absolute_error')
# print(f"Cross-Validation MAE: {-cv_scores.mean()}")

# # Visualize predictions
# plt.scatter(y_test, y_pred)
# plt.xlabel('Actual Prices')
# plt.ylabel('Predicted Prices')
# plt.title('Actual vs Predicted Prices')
# plt.show()

# # Step 4: Flask API
# app = Flask(__name__)

# @app.route('/predict', methods=['POST'])
# def predict():
#     data = request.get_json()
#     year = int(data['year'])
#     month = data['month']
#     vegetable = data['vegetable']
    
#     # Load model and encoders
#     model = pickle.load(open("price_model.pkl", "rb"))
#     label_encoder_veg = pickle.load(open("label_encoder_veg.pkl", "rb"))
#     label_encoder_month = pickle.load(open("label_encoder_month.pkl", "rb"))
    
#     # Encode inputs
#     try:
#         month_encoded = label_encoder_month.transform([month])[0]
#         vegetable_encoded = label_encoder_veg.transform([vegetable])[0]
#     except ValueError:
#         return jsonify({'error': 'Invalid month or vegetable name'})
    
#     # Predict
#     prediction = model.predict([[year, month_encoded, vegetable_encoded]])
#     return jsonify({'predicted_price': prediction[0]})

# @app.route('/options', methods=['GET'])
# def get_options():
#     # Provide available options
#     years = sorted(df_long['Year'].unique())
#     vegetables = label_encoder_veg.inverse_transform(sorted(df_long['Vegetable'].unique()))
#     months = label_encoder_month.inverse_transform(sorted(df_long['Month'].unique()))

#     return jsonify({
#         'years': years,
#         'months': list(months),
#         'vegetables': list(vegetables)
#     })

# if __name__ == '__main__':
#     app.run(debug=True)
