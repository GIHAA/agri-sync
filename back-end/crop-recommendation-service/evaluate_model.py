import joblib
from sklearn.metrics import accuracy_score, classification_report
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split

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

# Evaluate models and return metrics
def evaluate_model(model, X_test, y_test, model_name):
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, output_dict=True)
    return accuracy, report

# Main evaluation function
def main():
    # Load and preprocess data
    file_path = 'data/crop_recommendation_dataset.csv'  # Path to dataset
    X, y, label_mapping, scaler = load_and_preprocess_data(file_path)
    
    # Split the dataset into training and testing sets (80-20 split)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Load saved models
    lr_model = joblib.load('lr_model.pkl')
    xgb_model = joblib.load('xgb_model.pkl')
    rf_model = joblib.load('rf_model.pkl')

    # Evaluate the models
    lr_accuracy, lr_report = evaluate_model(lr_model, X_test, y_test, 'Logistic Regression')
    xgb_accuracy, xgb_report = evaluate_model(xgb_model, X_test, y_test, 'XGBoost')
    rf_accuracy, rf_report = evaluate_model(rf_model, X_test, y_test, 'Random Forest')

    # Display results
    print("Model Comparison Summary:")
    print(f"\nLogistic Regression (LR) Model:")
    print(f"Accuracy: {lr_accuracy:.4f}")
    print(f"Classification Report: {lr_report['accuracy']:.4f}")

    print(f"\nXGBoost (XGB) Model:")
    print(f"Accuracy: {xgb_accuracy:.4f}")
    print(f"Classification Report: {xgb_report['accuracy']:.4f}")

    print(f"\nRandom Forest (RF) Model:")
    print(f"Accuracy: {rf_accuracy:.4f}")
    print(f"Classification Report: {rf_report['accuracy']:.4f}")

    # Summary of comparisons
    print("\nSummary of Model Comparison:")
    models = {
        'Logistic Regression': lr_accuracy,
        'XGBoost': xgb_accuracy,
        'Random Forest': rf_accuracy
    }
    best_model = max(models, key=models.get)
    print(f"\nBest Model: {best_model} with accuracy {models[best_model]:.4f}")
    
if __name__ == "__main__":
    main()
