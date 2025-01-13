from flask import Flask, request, jsonify
from pymongo import MongoClient
import ssl
import logging
from logging.handlers import RotatingFileHandler
import os
import urllib.parse

# Create Flask app
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

# MongoDB Atlas connection details
MONGO_USERNAME = "agrisync"
MONGO_PASSWORD = urllib.parse.quote_plus("55e3QB2Hgn2yLTtD")
MONGO_CLUSTER = "cluster0.zm87w.mongodb.net"
MONGO_URI = f"mongodb+srv://{MONGO_USERNAME}:{MONGO_PASSWORD}@{MONGO_CLUSTER}/?retryWrites=true&w=majority"
DATABASE_NAME = "interaction_tracking"
COLLECTION_NAME = "button_interactions"

def get_mongo_client():
    """
    Create and return a MongoDB client with enhanced error handling
    """
    try:
        # Create a custom SSL context to bypass certificate verification
        # WARNING: This should only be used for debugging
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE

        client = MongoClient(
            MONGO_URI,
            tls=True,
            tlsAllowInvalidCertificates=True, 
            connectTimeoutMS=10000,  
            socketTimeoutMS=10000,   
            serverSelectionTimeoutMS=10000  
        )
        
        # Verify connection
        client.admin.command('ismaster')
        return client
    except Exception as e:
        app.logger.error(f"MongoDB Connection Error: {e}")
        raise

# Global client (can be recreated if connection fails)
try:
    mongo_client = get_mongo_client()
    db = mongo_client[DATABASE_NAME]
    collection = db[COLLECTION_NAME]
except Exception as e:
    app.logger.error(f"Initial MongoDB Connection Failed: {e}")
    mongo_client = None
    collection = None

@app.route('/track_interaction', methods=['POST'])
def track_interaction():
    try:
        # Recreate client if connection was lost
        global mongo_client, collection
        if mongo_client is None:
            try:
                mongo_client = get_mongo_client()
                db = mongo_client[DATABASE_NAME]
                collection = db[COLLECTION_NAME]
            except Exception as e:
                app.logger.error(f"Failed to reestablish MongoDB connection: {e}")
                return jsonify({"error": "Database connection failed"}), 500

        # Log incoming request details
        app.logger.info("Received request to track interaction.")
        data = request.get_json()
        
        # Validate incoming data
        if not data:
            app.logger.warning("Received empty interaction data")
            return jsonify({"error": "No data provided"}), 400
        
        app.logger.info(f"Data received: {data}")
        
        # Insert data into MongoDB
        result = collection.insert_one(data)
        
        return jsonify({
            "status": "success", 
            "inserted_id": str(result.inserted_id)
        }), 200
    
    except Exception as e:
        app.logger.error(f"Error tracking interaction: {e}")
        return jsonify({"error": str(e)}), 500

@app.errorhandler(500)
def internal_server_error(error):
    app.logger.error(f"Unhandled Exception: {error}")
    return jsonify({"error": "Internal Server Error"}), 500

if __name__ == '__main__':      
    app.run(
        debug=True, 
        host="0.0.0.0", 
        port=8000,
        use_reloader=False  # Prevents double logging in debug mode
    )