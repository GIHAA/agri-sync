import pickle
from sklearn.metrics import mean_squared_error, r2_score
import pandas as pd
from sklearn.model_selection import train_test_split

# Load the data
df = pd.read_excel("data.xlsx", sheet_name="Sheet2", skiprows=2)
df.columns = ['Index', 'Year', 'Vegetable', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
df = df.drop(columns=['Index'])
df = df[df['Year'] != 'Year']

# Ensure the data types are correct
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
for month in months:
    df[month] = pd.to_numeric(df[month], errors='coerce')
df['Year'] = pd.to_numeric(df['Year'], errors='coerce', downcast='integer')

# Reshape the data to long format
df_long = df.melt(id_vars=['Year', 'Vegetable'], value_vars=months, var_name='Month', value_name='Price')
df_long = df_long.dropna(subset=['Price'])

# Encode categorical data
from sklearn.preprocessing import LabelEncoder
label_encoder_veg = LabelEncoder()
label_encoder_month = LabelEncoder()
df_long['Vegetable'] = label_encoder_veg.fit_transform(df_long['Vegetable'])
df_long['Month'] = label_encoder_month.fit_transform(df_long['Month'])

# Split the data into features and target
X = df_long[['Year', 'Month', 'Vegetable']]
y = df_long['Price']

# Split into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Load the trained model
model = pickle.load(open("price_model.pkl", "rb"))

# Make predictions on the test set
y_pred = model.predict(X_test)

# Evaluate the model
# R² Score
r2 = r2_score(y_test, y_pred)
print(f"R² Score: {r2:.4f}")

# Mean Squared Error
mse = mean_squared_error(y_test, y_pred)
print(f"Mean Squared Error (MSE): {mse:.4f}")

# Root Mean Squared Error
rmse = mse ** 0.5
print(f"Root Mean Squared Error (RMSE): {rmse:.4f}")

# Mean Absolute Error (optional)
from sklearn.metrics import mean_absolute_error
mae = mean_absolute_error(y_test, y_pred)
print(f"Mean Absolute Error (MAE): {mae:.4f}")
