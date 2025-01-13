from flask import Flask, request, jsonify
from services.interaction_service import InteractionService
import logging
from logging.handlers import RotatingFileHandler
from utils.mongo_utils import get_mongo_client
import os

app = Flask(__name__)

# Configure logging
log_dir = 'logs'
os.makedirs(log_dir, exist_ok=True)
file_handler = RotatingFileHandler(
    os.path.join(log_dir, 'app.log'), 
    maxBytes=10240, 
    backupCount=10
)
file_handler.setFormatter(logging.Formatter(
    '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
))
file_handler.setLevel(logging.INFO)
app.logger.addHandler(file_handler)
app.logger.setLevel(logging.INFO)

# Instantiate the service
interaction_service = InteractionService()


@app.route('/track_interaction', methods=['POST'])
def log_interaction():
    data = request.get_json()
    if not data or 'button_id' not in data:
        return jsonify({"error": "Bad request, 'button_id' is required"}), 400
    try:
        # Log the button interaction using the service
        interaction_service.log_button_interaction(data)
        return jsonify({"message": "Interaction logged successfully"}), 200
    except Exception as e:
        app.logger.error(f"Error logging interaction: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/get_user_interactions/<user_id>', methods=['GET'])
def get_user_interactions(user_id):
    try:
        interactions = interaction_service.get_user_interactions(user_id)
        return jsonify(interactions), 200
    except Exception as e:
        app.logger.error(f"Error retrieving interactions for user {user_id}: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True)
 

# flask run --host=0.0.0.0 --port=3004