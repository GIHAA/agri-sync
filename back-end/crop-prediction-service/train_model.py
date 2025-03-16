import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from sklearn.ensemble import RandomForestClassifier
import xgboost as xgb
from sklearn.linear_model import LogisticRegression
import joblib
from sklearn.metrics import accuracy_score, classification_report

# Load and preprocess data
def load_and_preprocess_data(file_path):
    df = pd.read_csv(file_path)

    # Identify numeric columns
    numeric_cols = df.select_dtypes(include=['number']).columns
    df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].mean())  # Fill missing values with mean

    categorical_cols = df.select_dtypes(include=['object']).columns
    for col in categorical_cols:
        df[col] = df[col].fillna(df[col].mode()[0])  # Fill categorical missing values with mode

    # Assuming 'label' is the target variable
    X = df.drop('label', axis=1)  
    y = df['label']  

    # Convert target variable to labels
    label_mapping = {label: idx for idx, label in enumerate(y.unique())}
    y = y.map(label_mapping)

    # Normalize numeric features
    scaler = MinMaxScaler()
    X = scaler.fit_transform(X)

    return X, y, label_mapping, scaler

# Train Logistic Regression model
def train_logistic_regression_model(X_train, y_train):
    model = LogisticRegression(max_iter=1000)  # Increased iterations for convergence
    model.fit(X_train, y_train)
    return model

# Train XGBoost model
def train_xgboost_model(X_train, y_train):
    model = xgb.XGBClassifier()
    model.fit(X_train, y_train)
    return model

# Train Random Forest model
def train_rf_model(X_train, y_train):
    model = RandomForestClassifier()
    model.fit(X_train, y_train)
    return model

# Main function
def main():
    # Load and preprocess data
    file_path = 'data/crop_recommendation_dataset.csv'  # Path to dataset
    X, y, label_mapping, scaler = load_and_preprocess_data(file_path)
    
    # Split the dataset into training and testing sets (80-20 split)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train the Logistic Regression model
    print("Training Logistic Regression model...")
    lr_model = train_logistic_regression_model(X_train, y_train)

    # Train the XGBoost model
    print("Training XGBoost model...")
    xgb_model = train_xgboost_model(X_train, y_train)

    # Train the Random Forest model
    print("Training Random Forest model...")
    rf_model = train_rf_model(X_train, y_train)

    # Save models for future use
    print("Saving models...")
    joblib.dump(lr_model, 'lr_model.pkl')  # Save Logistic Regression model
    joblib.dump(xgb_model, 'xgb_model.pkl')  # Save XGBoost model
    joblib.dump(rf_model, 'rf_model.pkl')    # Save Random Forest model
    joblib.dump(scaler, 'scaler.pkl')        # Save scaler

    # Evaluate the models on the test set
    print("\nEvaluating Logistic Regression model...")
    y_pred_lr = lr_model.predict(X_test)
    print("Logistic Regression Accuracy:", accuracy_score(y_test, y_pred_lr))
    print(classification_report(y_test, y_pred_lr))

    print("\nEvaluating XGBoost model...")
    y_pred_xgb = xgb_model.predict(X_test)
    print("XGBoost Accuracy:", accuracy_score(y_test, y_pred_xgb))
    print(classification_report(y_test, y_pred_xgb))

    print("\nEvaluating Random Forest model...")
    y_pred_rf = rf_model.predict(X_test)
    print("Random Forest Accuracy:", accuracy_score(y_test, y_pred_rf))
    print(classification_report(y_test, y_pred_rf))

if __name__ == "__main__":
    main()
