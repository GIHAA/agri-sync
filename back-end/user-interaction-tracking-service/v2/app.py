from flask import Flask, jsonify, request
from flask_cors import CORS
import tensorflow as tf
from pymongo import MongoClient
import os
import numpy as np
from datetime import datetime

app = Flask(__name__)
CORS(app)

# MongoDB connection setup
mongo_uri = 'mongodb+srv://agrisync:55e3QB2Hgn2yLTtD@cluster0.zm87w.mongodb.net/agrisync_db?retryWrites=true&w=majority'
# Added database name 'agrisync_db' to the URI ----------------------------------------^

client = MongoClient(mongo_uri)
db = client['agrisync_db']  # Explicitly specify database name
touch_interactions = db.touch_interactions

# Ensure models directory exists
models_dir = './models'
if not os.path.exists(models_dir):
    os.makedirs(models_dir)

class UIOptimizationModel:
    def __init__(self):
        """
        Initialize a UIOptimizationModel instance.
        
        Sets default attributes for the instance: the model is initially None, the model_path is set to the 
        default file location for the Keras model, and the is_model_ready flag is initialized as False.
        """
        self.model = None
        self.model_path = './models/ui-model.keras'  # Added .keras extension
        self.is_model_ready = False

    async def initialize(self):  # Added self
        """
        Initializes and verifies the machine learning model asynchronously.
        
        Attempts to load an existing model from disk; if not found, creates a new model,
        compiles it with the Adam optimizer and mean squared error loss, and saves it.
        The function then verifies the model using an asynchronous check and sets the
        model readiness flag. Raises an Exception if model verification fails.
        """
        try:
            needs_compilation = True

            try:
                self.model = tf.keras.models.load_model(self.model_path)
                print('Loaded existing model')
                needs_compilation = False
            except:
                print('Creating new model...')
                self.model = self.create_model()
                needs_compilation = True

            if needs_compilation:
                self.model.compile(
                    optimizer=tf.keras.optimizers.Adam(0.001),
                    loss='mean_squared_error',
                    metrics=['mse']
                )
                print('Model compiled')
                # Save the newly created model
                self.model.save(self.model_path)
                print('New model saved to disk')

            is_working = await self.verify_model()
            if not is_working:
                raise Exception('Model verification failed after initialization')

            self.is_model_ready = True
            print('Model initialization completed successfully')
        except Exception as error:
            print('Error in model initialization:', str(error))
            self.is_model_ready = False
            raise error

    def create_model(self):
        """
        Creates and compiles a TensorFlow Keras sequential model.
        
        The model comprises three dense layers: the first layer with 32 units using ReLU activation and an input size of 6, the second with 16 units and ReLU activation, and a final output layer with 4 units using linear activation. It is compiled with the Adam optimizer (learning rate 0.001), mean squared error loss, and mean squared error as the metric.
        
        Returns:
            tf.keras.Sequential: The compiled neural network model.
        """
        model = tf.keras.Sequential([
            tf.keras.layers.Dense(
                32,
                activation='relu',
                input_shape=[6],
                kernel_initializer='glorot_normal'
            ),
            tf.keras.layers.Dense(
                16,
                activation='relu',
                kernel_initializer='glorot_normal'
            ),
            tf.keras.layers.Dense(
                4,
                activation='linear',
                kernel_initializer='glorot_normal'
            )
        ])

        model.compile(
            optimizer=tf.keras.optimizers.Adam(0.001),
            loss='mean_squared_error',
            metrics=['mse']
        )

        print('Model created and compiled successfully')
        return model

    async def verify_model(self):
        """
        Verifies the TensorFlow model's prediction output shape.
        
        Creates a test input and uses the model to generate a prediction.
        The function confirms that the prediction has exactly four columns; if so,
        it returns True, otherwise it logs the discrepancy and returns False.
        """
        try:
            test_input = tf.constant([[0.5, 0.5, 0.2, 0.2, 0.1, 0.1]], dtype=tf.float32)
            prediction = self.model.predict(test_input)
            shape = prediction.shape
            if shape[1] != 4:
                raise Exception(f'Invalid prediction shape: expected [n,4], got [{shape}]')
            return True
        except Exception as error:
            print('Model verification failed:', str(error))
            return False

    async def train_model(self, interactions):
        """
        Trains the ML model using touch interaction data.
        
        Filters out unsuccessful interactions and computes touch precision metrics along
        with an optimal button size. The function normalizes input data using device
        screen dimensions and trains the model with a validation split. An exception is
        raised if there are fewer than three successful interactions.
        
        Args:
            interactions: A list of interaction records. Each record should contain touch
                          point coordinates, device metrics (e.g., screen dimensions), and
                          button boundaries. Only records where 'isMissClick' is False are used.
        
        Returns:
            The training history from the model fit.
            
        Raises:
            Exception: If there are fewer than three successful interactions for training.
        """
        try:
            if not self.is_model_ready or self.model is None:
                await self.initialize()

            successful_clicks = [i for i in interactions if not i['isMissClick']]
            if len(successful_clicks) < 3:
                raise Exception('Not enough successful clicks for training')

            # Calculate touch point precision
            touch_points = [{'x': click['touchPoint']['x'], 'y': click['touchPoint']['y']} 
                          for click in successful_clicks]

            # Calculate center point
            center_x = sum(p['x'] for p in touch_points) / len(touch_points)
            center_y = sum(p['y'] for p in touch_points) / len(touch_points)

            # Calculate average deviation from center
            deviations = [{'x': abs(point['x'] - center_x), 'y': abs(point['y'] - center_y)}
                         for point in touch_points]

            avg_deviation = {
                'x': sum(d['x'] for d in deviations) / len(deviations),
                'y': sum(d['y'] for d in deviations) / len(deviations)
            }

            # Calculate precision score (0-1)
            max_allowed_deviation = 20  # pixels
            precision_score = min(
                1,
                1 - (max(avg_deviation['x'], avg_deviation['y']) / max_allowed_deviation)
            )

            print('Precision metrics:', {
                'avgDeviation': avg_deviation,
                'precisionScore': precision_score
            })

            # Calculate optimal size based on precision
            base_size_multiplier = 0.7 if precision_score > 0.8 else 1
            current_size = {
                'width': successful_clicks[0]['buttonBounds']['width'],
                'height': successful_clicks[0]['buttonBounds']['height']
            }

            # Calculate optimal size
            optimal_size = {
                'width': max(
                    min(
                        current_size['width'] * base_size_multiplier,
                        current_size['width']
                    ),
                    20  # Minimum touch target size
                ),
                'height': max(
                    min(
                        current_size['height'] * base_size_multiplier,
                        current_size['height']
                    ),
                    20
                )
            }

            # Prepare training data
            tensor_data = [[
                click['touchPoint']['x'] / click['deviceMetrics']['screenWidth'],
                click['touchPoint']['y'] / click['deviceMetrics']['screenHeight'],
                click['buttonBounds']['x'] / click['deviceMetrics']['screenWidth'],
                click['buttonBounds']['y'] / click['deviceMetrics']['screenHeight'],
                click['buttonBounds']['width'] / click['deviceMetrics']['screenWidth'],
                click['buttonBounds']['height'] / click['deviceMetrics']['screenHeight']
            ] for click in successful_clicks]

            target_data = [[
                click['touchPoint']['x'] / click['deviceMetrics']['screenWidth'],
                click['touchPoint']['y'] / click['deviceMetrics']['screenHeight'],
                optimal_size['width'] / click['deviceMetrics']['screenWidth'],
                optimal_size['height'] / click['deviceMetrics']['screenHeight']
            ] for click in successful_clicks]

            xs = tf.constant(tensor_data, dtype=tf.float32)
            ys = tf.constant(target_data, dtype=tf.float32)

            history = self.model.fit(
                xs, ys,
                epochs=50,
                batch_size=min(32, len(successful_clicks) // 2),
                shuffle=True,
                validation_split=0.2
            )

            return history

        except Exception as error:
            print('Training error:', str(error))
            raise error

    async def predict(self, metrics):
        """
        Predicts adjusted UI element coordinates and dimensions based on input metrics.
        
        The function normalizes the provided UI metrics relative to screen dimensions and
        passes them through a TensorFlow model to obtain predicted adjustments. It then
        ensures that the predicted width and height do not fall below a minimum threshold,
        preserving usability by enforcing at least 80% of the original size or 44 pixels.
        
        Parameters:
            metrics (dict): A dictionary containing the following keys:
                'x' (float): The x-coordinate of the element.
                'y' (float): The y-coordinate of the element.
                'width' (float): The current width of the element.
                'height' (float): The current height of the element.
                'screenWidth' (float): The width of the screen.
                'screenHeight' (float): The height of the screen.
        
        Returns:
            list: A list of four numbers where:
                - The first two represent predicted x and y positions.
                - The last two represent normalized predicted dimensions (width and height),
                  adjusted to meet the minimum size requirements.
        """
        try:
            if not self.is_model_ready or self.model is None:
                await self.initialize()

            input_data = tf.constant([[
                metrics['x'] / metrics['screenWidth'],
                metrics['y'] / metrics['screenHeight'],
                metrics['width'] / metrics['screenWidth'],
                metrics['height'] / metrics['screenHeight'],
                1,
                1
            ]], dtype=tf.float32)

            prediction = self.model.predict(input_data)

            # Process predictions with minimum sizes
            min_width = max(metrics['width'] * 0.8, 44)  # Never reduce by more than 20%
            min_height = max(metrics['height'] * 0.8, 44)

            return [
                prediction[0][0],
                prediction[0][1],
                max(prediction[0][2] * metrics['screenWidth'], min_width) / metrics['screenWidth'],
                max(prediction[0][3] * metrics['screenHeight'], min_height) / metrics['screenHeight']
            ]
        except Exception as error:
            print('Prediction error:', str(error))
            raise error

# Initialize ML model
ml_model = UIOptimizationModel()

@app.route('/api/model-status', methods=['GET'])
async def get_model_status():
    """
    Return the status and configuration details of the ML model.
    
    This asynchronous function checks if the machine learning model is initialized and,
    if so, verifies its functionality by calling an asynchronous verification routine.
    It returns a JSON response containing the model's operational status along with configuration
    details such as whether the model is compiled, the number of layers, and its input and output shapes.
    In case of any error during the check, it returns a JSON response with an error message and an HTTP 500 status.
    """
    try:
        if not ml_model.is_model_ready:
            return jsonify({
                'status': 'not_ready',
                'message': 'Model is not initialized'
            })

        is_working = await ml_model.verify_model()
        return jsonify({
            'status': 'ready' if is_working else 'error',
            'message': 'Model is working correctly' if is_working else 'Model verification failed',
            'modelInfo': {
                'isCompiled': ml_model.model.compiled_loss is not None,
                'layers': len(ml_model.model.layers),
                'inputShape': ml_model.model.input_shape,
                'outputShape': ml_model.model.output_shape
            }
        })
    except Exception as error:
        return jsonify({
            'status': 'error',
            'message': 'Error checking model status',
            'error': str(error)
        }), 500

@app.route('/api/touch-interactions', methods=['POST'])
def save_interaction():
    """
    Saves a touch interaction to the database.
    
    Extracts the JSON payload from the incoming request and inserts it as an interaction record
    into the database. Returns a JSON response with a success message and HTTP status 201 upon
    successful insertion. In case of an error, logs the error and returns a JSON error response
    with HTTP status 500.
    """
    try:
        interaction = request.json
        #  interaction['createdAt'] = datetime.utcnow()  # Add timestamp in UTC

        touch_interactions.insert_one(interaction)  # Save to database
        return jsonify({'message': 'Interaction saved'}), 201
    except Exception as error:
        print('Error saving interaction:', str(error))
        return jsonify({
            'error': 'Error saving interaction',
            'details': str(error)
        }), 500

@app.route('/api/bulk-touch-interactions', methods=['POST'])
def save_bulk_interactions():
    """
    Saves multiple touch interactions to the database.
    
    Extracts a list of interactions from the JSON request payload and performs a bulk insert into the database.
    If the payload is not a list, returns a 400 response indicating that the request body must be an array.
    On successful insertion, returns a 201 response with a success message and the count of interactions inserted.
    If an exception occurs, returns a 500 response with an error message and details.
    """
    try:
        interactions = request.json
        if not isinstance(interactions, list):
            return jsonify({'error': 'Request body must be an array'}), 400

        touch_interactions.insert_many(interactions)
        return jsonify({
            'message': 'Bulk interactions saved successfully',
            'count': len(interactions)
        }), 201
    except Exception as error:
        print('Error saving bulk interactions:', str(error))
        return jsonify({
            'error': 'Error saving bulk interactions',
            'details': str(error)
        }), 500

@app.route('/api/train', methods=['POST'])
async def train():
    """
    Trains the machine learning model using button-specific touch interactions.
    
    This asynchronous function retrieves touch interactions for the button specified in the JSON 
    request (via the 'buttonId' field), filters out unsuccessful clicks, and verifies that there 
    are at least three successful interactions available for training. If sufficient data is found, 
    it trains the model, saves the updated model file, and returns a JSON response with training 
    history and key performance metrics. In case of insufficient data or any errors during data 
    retrieval or training, the function returns an error JSON response with the appropriate HTTP 
    status code.
    """
    button_id = request.json.get('buttonId')
    
    try:
        interactions = list(touch_interactions.find({'buttonId': button_id}))
        successful_clicks = [i for i in interactions if not i['isMissClick']]

        if len(successful_clicks) < 3:
            return jsonify({
                'error': 'Not enough successful clicks for training',
                'requiredSamples': 3,
                'currentSamples': len(successful_clicks)
            }), 400

        print(f'Training model with {len(successful_clicks)} successful interactions out of {len(interactions)} total')
        
        try:
            history = await ml_model.train_model(interactions)
            ml_model.model.save(ml_model.model_path)
            
            return jsonify({
                'message': 'Model trained successfully',
                'dataPoints': {
                    'total': len(interactions),
                    'successful': len(successful_clicks)
                },
                'history': history.history,
                'metrics': {
                    'finalLoss': float(history.history['loss'][-1]),
                    'finalValidationLoss': float(history.history['val_loss'][-1]) if 'val_loss' in history.history else None
                }
            })
        except Exception as training_error:
            print('Training error:', str(training_error))
            return jsonify({
                'error': 'Error during model training',
                'details': str(training_error)
            }), 500
    except Exception as error:
        print('Database error:', str(error))
        return jsonify({
            'error': 'Error accessing training data',
            'details': str(error)
        }), 500

@app.route('/api/predict', methods=['POST'])
async def predict():
    """
    Processes a prediction request and returns scaled UI component dimensions.
    
    Extracts 'metrics' from the JSON request body, invokes the machine learning model to obtain predictions,
    and scales the resulting values using the provided screen dimensions. Returns a JSON response with the computed
    x, y, width, and height, or an error message with status code 500 if prediction fails.
    """
    metrics = request.json.get('metrics')
    
    try:
        prediction = await ml_model.predict(metrics)
        return jsonify({
            'x': prediction[0] * metrics['screenWidth'],
            'y': prediction[1] * metrics['screenHeight'],
            'width': prediction[2] * metrics['screenWidth'],
            'height': prediction[3] * metrics['screenHeight']
        })
    except Exception as error:
        print('Prediction error:', str(error))
        return jsonify({
            'error': 'Error making prediction',
            'details': str(error)
        }), 500

@app.route('/api/button-recommendations/<button_id>', methods=['GET'])
def get_button_recommendations(button_id):
    """
    Analyzes touch interactions for a button and recommends UI adjustments.
    
    This function retrieves touch interactions for the provided button identifier from the database and computes statistics based on successful and missed clicks. It calculates adjustment factors using touch point spread, miss click rate, and precision score to recommend new UI dimensions. If there are no interactions or no successful clicks, a 404 JSON error response is returned. On unexpected errors, the function returns a 500 JSON error response.
    
    Args:
        button_id: The unique identifier of the button whose interactions are to be analyzed.
    
    Returns:
        A Flask JSON response containing the recommended dimensions, statistical details, and adjustment factors,
        or an error message if data is insufficient or an error occurs.
    """
    try:
        interactions = list(touch_interactions.find({'buttonId': button_id}))
        
        if not interactions:
            return jsonify({
                'error': 'No interaction data found for this button'
            }), 404
    
        # Get successful clicks
        successful_clicks = [i for i in interactions if not i['isMissClick']]
        
        if not successful_clicks:
            return jsonify({
                'error': 'No successful clicks found for this button'
            }), 404
    
        # Calculate touch point spread
        touch_points = [{'x': click['touchPoint']['x'], 'y': click['touchPoint']['y']}
                       for click in successful_clicks]
    
        x_values = [p['x'] for p in touch_points]
        y_values = [p['y'] for p in touch_points]
        x_spread = max(x_values) - min(x_values)
        y_spread = max(y_values) - min(y_values)
    
        # Calculate average dimensions from successful interactions
        avg_dimensions = {
            'width': sum(click['buttonBounds']['width'] for click in successful_clicks) / len(successful_clicks),
            'height': sum(click['buttonBounds']['height'] for click in successful_clicks) / len(successful_clicks)
        }
    
        # Calculate miss click rate
        miss_click_rate = (len(interactions) - len(successful_clicks)) / len(interactions)
    
        # Calculate precision score
        max_spread = 20  # pixels
        precision_score = 1 - min(max(x_spread, y_spread) / max_spread, 1)
    
        # Calculate size adjustment factors
        if miss_click_rate > 0.3:
            # High miss rate - increase size
            increase_amount = min(miss_click_rate * 0.5, 0.2)  # Max 20% increase
            width_adjustment = height_adjustment = 1 + increase_amount
        elif precision_score > 0.8:
            # High precision - decrease size
            decrease_amount = min(precision_score * 0.3, 0.2)  # Max 20% decrease
            width_adjustment = height_adjustment = 1 - decrease_amount
        else:
            # Maintain current size
            width_adjustment = height_adjustment = 1
    
        # Calculate recommended dimensions
        recommended_dimensions = {
            'width': max(round(avg_dimensions['width'] * width_adjustment), 44),
            'height': max(round(avg_dimensions['height'] * height_adjustment), 44)
        }
    
        # Calculate size changes
        width_change = round(((recommended_dimensions['width'] - avg_dimensions['width']) / avg_dimensions['width']) * 100)
        height_change = round(((recommended_dimensions['height'] - avg_dimensions['height']) / avg_dimensions['height']) * 100)

        # Determine overall adjustment direction and magnitude
        max_change = max(abs(width_change), abs(height_change))
        if max_change == 0:
            change_type = 'no change'
        elif max_change == abs(width_change):
            change_type = 'increase' if width_change > 0 else 'decrease'
        else:
            change_type = 'increase' if height_change > 0 else 'decrease'

        return jsonify({
            'buttonId': button_id,
            'recommendations': {
                'dimensions': recommended_dimensions,
                'statistics': {
                    'totalInteractions': len(interactions),
                    'successfulClicks': len(successful_clicks),
                    'missClickRate': round(miss_click_rate * 100),
                    'confidence': len(successful_clicks) / 10,
                    'precisionScore': round(precision_score * 100)
                },
                'source': 'ml_model',
                'adjustmentFactor': 'no change' if max_change == 0 else f'{abs(max_change)}% {change_type}',
                'originalAverage': {
                    'width': round(avg_dimensions['width']),
                    'height': round(avg_dimensions['height'])
                },
                'sizeChanges': {
                    'width': width_change,
                    'height': height_change
                }
            }
        })

    except Exception as error:
        print('Error getting button recommendations:', str(error))
        return jsonify({
            'error': 'Error analyzing button interactions',
            'details': str(error)
        }), 500

if __name__ == '__main__':
    import asyncio
    from hypercorn.config import Config
    from hypercorn.asyncio import serve

    config = Config()
    config.bind = ["0.0.0.0:3005"]
    
    async def start_server():
        """
        Starts the server and initializes the ML model.
        
        Attempts to asynchronously initialize the machine learning model. If initialization fails,
        an error message is printed and the server continues running without the model, retrying
        initialization on the first request. Finally, the server is started using the provided
        application configuration.
        """
        try:
            await ml_model.initialize()
            print('Server running on port 3005 with initialized ML model')
        except Exception as error:
            print('Server initialization error:', str(error))
            print('Server will continue running without ML model. Will retry initialization on first request.')
        
        await serve(app, config)

    asyncio.run(start_server())