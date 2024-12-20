
import pickle
from sklearn.metrics import mean_squared_error, r2_score
import pandas as pd
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder

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
label_encoder_veg = LabelEncoder()
df_long['Vegetable_encoded'] = label_encoder_veg.fit_transform(df_long['Vegetable'])

# Split the data into training and test sets
X = df_long[['Year', 'Vegetable_encoded', 'Month']]
y = df_long['Price']

# One-hot encoding for months
X = pd.get_dummies(X, columns=['Month'], drop_first=True)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train a model
model = LinearRegression()
model.fit(X_train, y_train)

# Predict the prices
y_pred = model.predict(X_test)

# Evaluate the model
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
print(f'Mean Squared Error: {mse}')
print(f'R²: {r2}')

# Plotting the results
plt.figure(figsize=(10, 6))
plt.plot(y_test.values, label='Actual Prices', color='blue')
plt.plot(y_pred, label='Predicted Prices', color='red', linestyle='--')
plt.xlabel('Data Points')
plt.ylabel('Price')
plt.title('Actual vs Predicted Prices')
plt.legend()
plt.show()

# Save the model using pickle
with open('price_prediction_model.pkl', 'wb') as f:
    pickle.dump(model, f)
