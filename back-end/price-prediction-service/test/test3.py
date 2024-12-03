# import pickle
# from sklearn.metrics import mean_squared_error, r2_score
# import pandas as pd
# from sklearn.model_selection import train_test_split
# import matplotlib.pyplot as plt
# from sklearn.linear_model import LinearRegression
# from sklearn.tree import DecisionTreeRegressor
# from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
# from sklearn.svm import SVR
# from sklearn.neighbors import KNeighborsRegressor
# from xgboost import XGBRegressor
# from sklearn.preprocessing import LabelEncoder

# # Load the data
# df = pd.read_excel("data.xlsx", sheet_name="Sheet2", skiprows=2)
# df.columns = ['Index', 'Year', 'Vegetable', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
#               'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
# df = df.drop(columns=['Index'])
# df = df[df['Year'] != 'Year']

# # Ensure the data types are correct
# months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
# for month in months:
#     df[month] = pd.to_numeric(df[month], errors='coerce')
# df['Year'] = pd.to_numeric(df['Year'], errors='coerce', downcast='integer')

# # Reshape the data to long format
# df_long = df.melt(id_vars=['Year', 'Vegetable'], value_vars=months, var_name='Month', value_name='Price')
# df_long = df_long.dropna(subset=['Price'])

# # Encode categorical data (Vegetable)
# label_encoder_veg = LabelEncoder()
# df_long['Vegetable'] = label_encoder_veg.fit_transform(df_long['Vegetable'])

# # Prepare feature matrix and target vector
# X = df_long[['Year', 'Vegetable', 'Month']]  # Features: Year, Vegetable, Month
# y = df_long['Price']  # Target: Price

# # One-hot encoding for 'Month'
# X = pd.get_dummies(X, columns=['Month'], drop_first=True)

# # Split data into train and test sets
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# # Define models to compare
# models = {
#     "Linear Regression": LinearRegression(),
#     "Decision Tree": DecisionTreeRegressor(),
#     "Random Forest": RandomForestRegressor(),
#     "Support Vector Regressor (SVR)": SVR(),
#     "K-Nearest Neighbors": KNeighborsRegressor(),
#     "Gradient Boosting": GradientBoostingRegressor(),
#     "XGBoost": XGBRegressor()
# }

# # Store results for comparison
# results = {}

# # Train and evaluate each model
# for model_name, model in models.items():
#     model.fit(X_train, y_train)  # Train the model
#     y_pred = model.predict(X_test)  # Predict on test data
#     mse = mean_squared_error(y_test, y_pred)  # Mean Squared Error
#     r2 = r2_score(y_test, y_pred)  # R-squared score
#     results[model_name] = {'MSE': mse, 'R2': r2}  # Store the results

# # Display the results in a DataFrame for comparison
# results_df = pd.DataFrame(results).T
# print(results_df)

# # Visualize the results
# results_df.plot(kind='bar', figsize=(10, 6))
# plt.title('Model Comparison: MSE and R²')
# plt.xlabel('Models')
# plt.ylabel('Scores')
# plt.xticks(rotation=45)
# plt.tight_layout()
# plt.show()

# # Choose the best model based on R² or MSE
# best_model_name = results_df['R2'].idxmax()  # Model with highest R²
# best_model = models[best_model_name]

# # Save the best model
# with open('best_model.pkl', 'wb') as f:
#     pickle.dump(best_model, f)

# print(f"The best model is {best_model_name} with R² score: {results_df['R2'].max()}")


# import pickle
# import pandas as pd
# import numpy as np
# import matplotlib.pyplot as plt
# from sklearn.metrics import mean_squared_error, r2_score
# from sklearn.model_selection import train_test_split
# from sklearn.linear_model import LinearRegression
# from sklearn.tree import DecisionTreeRegressor
# from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
# from sklearn.svm import SVR
# from sklearn.neighbors import KNeighborsRegressor
# from xgboost import XGBRegressor
# from sklearn.preprocessing import LabelEncoder

# # Load the data
# df = pd.read_excel("data.xlsx", sheet_name="Sheet2", skiprows=2)
# df.columns = ['Index', 'Year', 'Vegetable', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
#               'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
# df = df.drop(columns=['Index'])
# df = df[df['Year'] != 'Year']

# # Ensure the data types are correct
# months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
# for month in months:
#     df[month] = pd.to_numeric(df[month], errors='coerce')

# # Prepare the data for regression (example using 'Jan' as the target)
# X = df[['Year', 'Vegetable']]  # Features
# y = df['Jan']  # Target variable

# # Encoding categorical variables
# label_encoder = LabelEncoder()
# X['Vegetable'] = label_encoder.fit_transform(X['Vegetable'])

# # Split the data into training and testing sets
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# # Initialize regression models
# models = {
#     "Linear Regression": LinearRegression(),
#     "Decision Tree": DecisionTreeRegressor(),
#     "Random Forest": RandomForestRegressor(),
#     "Gradient Boosting": GradientBoostingRegressor(),
#     "SVR": SVR(),
#     "K-Neighbors": KNeighborsRegressor(),
#     "XGBoost": XGBRegressor()
# }

# # Store results
# results = {}

# # Train and evaluate models
# for name, model in models.items():
#     model.fit(X_train, y_train)
#     y_pred = model.predict(X_test)
#     mse = mean_squared_error(y_test, y_pred)
#     r2 = r2_score(y_test, y_pred)
#     results[name] = {'MSE': mse, 'R²': r2}

#     # Plot predicted vs actual
#     plt.figure(figsize=(6, 4))
#     plt.scatter(y_test, y_pred, color='blue', label="Predicted vs Actual")
#     plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], color='red', lw=2, label="Ideal Line")
#     plt.title(f'{name} Model: Predicted vs Actual')
#     plt.xlabel('Actual Values')
#     plt.ylabel('Predicted Values')
#     plt.legend()
#     plt.grid(True)
#     plt.show()

# # Display model performance
# results_df = pd.DataFrame(results).T
# print(results_df)

# # Bar plot to compare models' R² scores
# results_df['R²'].plot(kind='bar', figsize=(10, 6), color='skyblue')
# plt.title('Model Comparison by R² Score')
# plt.ylabel('R²')
# plt.xlabel('Model')
# plt.xticks(rotation=45)
# plt.show()


import pickle
from sklearn.metrics import mean_squared_error, r2_score
import pandas as pd
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.svm import SVR
from sklearn.neighbors import KNeighborsRegressor
from xgboost import XGBRegressor
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

# Encode categorical data (Vegetable)
label_encoder_veg = LabelEncoder()
df_long['Vegetable'] = label_encoder_veg.fit_transform(df_long['Vegetable'])

# Prepare feature matrix and target vector
X = df_long[['Year', 'Vegetable', 'Month']]  # Features: Year, Vegetable, Month
y = df_long['Price']  # Target: Price

# One-hot encoding for 'Month'
X = pd.get_dummies(X, columns=['Month'], drop_first=True)

# Split data into train and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Define models to compare
models = {
    "Linear Regression": LinearRegression(),
    "Random Forest": RandomForestRegressor(),
    "K-Nearest Neighbors": KNeighborsRegressor(),
    "Gradient Boosting": GradientBoostingRegressor()
}

# Store results for comparison
results = {}

# Train and evaluate each model
for model_name, model in models.items():
    model.fit(X_train, y_train)  # Train the model
    y_pred = model.predict(X_test)  # Predict on test data
    mse = mean_squared_error(y_test, y_pred)  # Mean Squared Error
    r2 = r2_score(y_test, y_pred)  # R-squared score
    results[model_name] = {'MSE': mse, 'R2': r2}  # Store the results

# Display the results in a DataFrame for comparison
results_df = pd.DataFrame(results).T
print(results_df)

# Visualize the results
results_df.plot(kind='bar', figsize=(10, 6))
plt.title('Model Comparison: MSE and R²')
plt.xlabel('Models')
plt.ylabel('Scores')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

# plot R2 separately

results_df['R2'].plot(kind='bar', figsize=(10, 6), color='skyblue')
plt.title('Model Comparison by R² Score')
plt.ylabel('R²')
plt.xlabel('Model')
plt.xticks(rotation=45)
plt.show()


# plot MSE separately

results_df['MSE'].plot(kind='bar', figsize=(10, 6), color='skyblue')
plt.title('Model Comparison by MSE Score')
plt.ylabel('MSE')
plt.xlabel('Model')
plt.xticks(rotation=45)
plt.show()


# Choose the best model based on R² or MSE
best_model_name = results_df['R2'].idxmax()  # Model with highest R²
best_model = models[best_model_name]

# Save the best model
with open('best_model.pkl', 'wb') as f:
    pickle.dump(best_model, f)

print(f"The best model is {best_model_name} with R² score: {results_df['R2'].max()}")