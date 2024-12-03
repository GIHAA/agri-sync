import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
import xgboost as xgb
import time

def generate_synthetic_data(n_samples=1000):
    np.random.seed(42)
    X = np.random.rand(n_samples, 6)
    y = np.random.rand(n_samples, 4)
    return X, y

def create_current_model():
    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(6,)),
        tf.keras.layers.Dense(32, activation='relu'),
        tf.keras.layers.Dense(16, activation='relu'),
        tf.keras.layers.Dense(4, activation='linear')
    ])
    model.compile(optimizer=tf.keras.optimizers.Adam(0.001),
                 loss='mse',
                 metrics=['mse'])
    return model

def create_deeper_model():
    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(6,)),
        tf.keras.layers.Dense(64, activation='relu'),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.Dense(32, activation='relu'),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Dense(16, activation='relu'),
        tf.keras.layers.Dense(4, activation='linear')
    ])
    model.compile(optimizer=tf.keras.optimizers.Adam(0.001),
                 loss='mse',
                 metrics=['mse'])
    return model

def create_xgboost_model():
    return xgb.XGBRegressor(
        n_estimators=100,
        learning_rate=0.1,
        max_depth=5,
        objective='reg:squarederror'
    )

def measure_inference_time(model, X_test, n_runs=10):
    times = []
    for _ in range(n_runs):
        start = time.time()
        _ = model.predict(X_test[:1])
        times.append(time.time() - start)
    return np.mean(times) * 1000  # Convert to milliseconds

def compare_models():
    X, y = generate_synthetic_data()
    X_train, X_test = X[:800], X[800:]
    y_train, y_test = y[:800], y[800:]
    
    results = {}
    
    # Current Model
    model = create_current_model()
    start_time = time.time()
    model.fit(X_train, y_train, epochs=50, batch_size=32, verbose=0)
    training_time = time.time() - start_time
    inference_time = measure_inference_time(model, X_test)
    results['Current Model'] = {
        'Training Time (s)': training_time,
        'Inference Time (ms)': inference_time,
        'Parameters': model.count_params()
    }

    # Deeper Model
    model = create_deeper_model()
    start_time = time.time()
    model.fit(X_train, y_train, epochs=50, batch_size=32, verbose=0)
    training_time = time.time() - start_time
    inference_time = measure_inference_time(model, X_test)
    results['Deeper Model'] = {
        'Training Time (s)': training_time,
        'Inference Time (ms)': inference_time,
        'Parameters': model.count_params()
    }

    # XGBoost
    model = create_xgboost_model()
    start_time = time.time()
    model.fit(X_train, y_train.reshape(y_train.shape[0], -1))
    training_time = time.time() - start_time
    inference_time = measure_inference_time(model, X_test)
    results['XGBoost'] = {
        'Training Time (s)': training_time,
        'Inference Time (ms)': inference_time,
        'Parameters': model.get_booster().num_features()
    }

    return results

if __name__ == "__main__":
    results = compare_models()åå
    for model_name, metrics in results.items():
        print(f"\n{model_name}:")
        for metric, value in metrics.items():
            print(f"{metric}: {value:.4f}")