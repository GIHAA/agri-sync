# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel, Field
# from motor.motor_asyncio import AsyncIOMotorClient
# from datetime import datetime
# import uvicorn
# import os
# from dotenv import load_dotenv

# # Load environment variables
# load_dotenv()

# # Create FastAPI app
# app = FastAPI(title="Interaction Tracking API")

# # MongoDB connection string
# MONGO_URI = "mongodb+srv://thperera2000:lFH4uWJYrEgCQxKD@cluster0.brak3.mongodb.net/"
# DATABASE_NAME = "interaction_tracking"
# COLLECTION_NAME = "button_interactions"

# # Pydantic model for validation
# class ClickCoordinates(BaseModel):
#     x: float
#     y: float

# class InteractionData(BaseModel):
#     user_id: str
#     button_id: str
#     click_coordinates: ClickCoordinates
#     missed_click_distance: float = Field(default=0)
#     is_miss_click: bool = Field(default=False)
#     session_duration: int
#     device: str
#     timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

# # MongoDB client
# class MongoDB:
#     _client = None
#     _db = None
#     _collection = None

#     @classmethod
#     async def get_client(cls):
#         if not cls._client:
#             cls._client = AsyncIOMotorClient(MONGO_URI)
#             cls._db = cls._client[DATABASE_NAME]
#             cls._collection = cls._db[COLLECTION_NAME]
#         return cls._client

#     @classmethod
#     async def get_collection(cls):
#         if not cls._collection:
#             await cls.get_client()
#         return cls._collection

# # Startup event to verify MongoDB connection
# @app.on_event("startup")
# async def startup_event():
#     try:
#         client = await MongoDB.get_client()
#         # Verify connection by pinging the database
#         await client.admin.command('ping')
#         print("Successfully connected to MongoDB!")
#     except Exception as e:
#         print(f"Failed to connect to MongoDB: {e}")

# # Route to track button interactions
# @app.post("/track-interaction")
# async def track_interaction(interaction: InteractionData):
#     try:
#         # Get MongoDB collection
#         collection = await MongoDB.get_collection()
        
#         # Convert interaction data to dictionary
#         interaction_dict = interaction.model_dump()
        
#         # Insert interaction data
#         result = await collection.insert_one(interaction_dict)
        
#         return {
#             "status": "success",
#             "message": "Interaction tracked",
#             "inserted_id": str(result.inserted_id)
#         }
#     except Exception as e:
#         # Log the error (in a real-world scenario, use proper logging)
#         print(f"Error tracking interaction: {e}")
#         raise HTTPException(status_code=500, detail="Failed to track interaction")

# # Aggregation route to get interaction insights
# @app.get("/interaction-insights")
# async def get_interaction_insights():
#     try:
#         collection = await MongoDB.get_collection()
        
#         # Aggregation pipeline to get insights
#         pipeline = [
#             # Group by button_id and calculate metrics
#             {
#                 "$group": {
#                     "_id": "$button_id",
#                     "total_interactions": {"$sum": 1},
#                     "miss_clicks": {"$sum": {"$cond": ["$is_miss_click", 1, 0]}},
#                     "avg_miss_click_distance": {"$avg": "$missed_click_distance"},
#                     "unique_users": {"$addToSet": "$user_id"}
#                 }
#             },
#             # Add more stages as needed
#             {
#                 "$project": {
#                     "button_id": "$_id",
#                     "total_interactions": 1,
#                     "miss_clicks": 1,
#                     "miss_click_rate": {"$divide": ["$miss_clicks", "$total_interactions"]},
#                     "unique_user_count": {"$size": "$unique_users"},
#                     "avg_miss_click_distance": 1
#                 }
#             }
#         ]
        
#         # Execute aggregation
#         insights = await collection.aggregate(pipeline).to_list(length=None)
        
#         return {
#             "status": "success",
#             "insights": insights
#         }
#     except Exception as e:
#         print(f"Error getting interaction insights: {e}")
#         raise HTTPException(status_code=500, detail="Failed to retrieve interaction insights")

# # Main entry point
# if __name__ == "__main__":
#     # Run the server
#     uvicorn.run(
#         "main:app", 
#         host="0.0.0.0", 
#         port=3002, 
#         reload=True
#     )



# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel, Field
# from motor.motor_asyncio import AsyncIOMotorClient
# from datetime import datetime
# import uvicorn

# # Create FastAPI app
# app = FastAPI(title="Interaction Tracking API")

# # MongoDB connection string (hardcoded)
# MONGO_URI = "mongodb+srv://thperera2000:lFH4uWJYrEgCQxKD@cluster0.brak3.mongodb.net/"
# DATABASE_NAME = "interaction_tracking"
# COLLECTION_NAME = "button_interactions"

# # Pydantic model for validation
# class ClickCoordinates(BaseModel):
#     x: float
#     y: float

# class InteractionData(BaseModel):
#     user_id: str
#     button_id: str
#     click_coordinates: ClickCoordinates
#     missed_click_distance: float = Field(default=0)
#     is_miss_click: bool = Field(default=False)
#     session_duration: int
#     device: str
#     timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

# # MongoDB client
# class MongoDB:
#     _client = None
#     _db = None
#     _collection = None

#     @classmethod
#     async def get_client(cls):
#         if not cls._client:
#             cls._client = AsyncIOMotorClient(MONGO_URI)
#             cls._db = cls._client[DATABASE_NAME]
#             cls._collection = cls._db[COLLECTION_NAME]
#         return cls._collection

# # Endpoint to log button interaction
# @app.post("/log_interaction/")
# async def log_interaction(data: InteractionData):
#     collection = await MongoDB.get_client()
#     interaction_data = data.dict()
#     try:
#         # Insert interaction data into MongoDB
#         result = await collection.insert_one(interaction_data)
#         return {"message": "Interaction logged successfully", "id": str(result.inserted_id)}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# # Endpoint to get all logged interactions (example query)
# @app.get("/get_interactions/")
# async def get_interactions():
#     collection = await MongoDB.get_client()
#     try:
#         interactions = await collection.find().to_list(100)  # Get top 100 interactions
#         return interactions
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# # Run the app with uvicorn
# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=3002)


# from flask import Flask, request, jsonify
# from pydantic import BaseModel, Field
# from datetime import datetime
# from motor.motor_asyncio import AsyncIOMotorClient
# import asyncio
# import threading

# # Create Flask app
# app = Flask(__name__)

# # MongoDB connection string (hardcoded)
# MONGO_URI = "mongodb+srv://thperera2000:lFH4uWJYrEgCQxKD@cluster0.brak3.mongodb.net/"
# DATABASE_NAME = "interaction_tracking"
# COLLECTION_NAME = "button_interactions"

# # Pydantic model for validation
# class ClickCoordinates(BaseModel):
#     x: float
#     y: float

# class InteractionData(BaseModel):
#     user_id: str
#     button_id: str
#     click_coordinates: ClickCoordinates
#     missed_click_distance: float = Field(default=0)
#     is_miss_click: bool = Field(default=False)
#     session_duration: int
#     device: str
#     timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

# # MongoDB client
# class MongoDB:
#     _client = None
#     _db = None
#     _collection = None

#     @classmethod
#     async def get_client(cls):
#         if not cls._client:
#             cls._client = AsyncIOMotorClient(MONGO_URI)
#             cls._db = cls._client[DATABASE_NAME]
#             cls._collection = cls._db[COLLECTION_NAME]
#         return cls._collection

# # Helper function to handle async tasks in Flask
# def run_async(func):
#     def wrapper(*args, **kwargs):
#         loop = asyncio.new_event_loop()
#         threading.Thread(target=lambda: loop.run_until_complete(func(*args, **kwargs))).start()
#     return wrapper

# @app.route('/interactions', methods=['POST'])
# @run_async
# async def track_interaction():
#     # Parse JSON body
#     data = request.get_json()

#     try:
#         interaction = InteractionData(**data)
#     except ValueError as e:
#         return jsonify({"error": "Invalid data", "details": str(e)}), 400

#     # Save data to MongoDB
#     collection = await MongoDB.get_client()
#     await collection.insert_one(interaction.dict())

#     return jsonify({"message": "Interaction recorded successfully"}), 200

# # Entry point to run the app
# if __name__ == '__main__':
#     app.run(debug=True, host="0.0.0.0", port=8000)




# import threading
# from flask import Flask, request, jsonify
# from pydantic import BaseModel, Field
# from datetime import datetime
# from motor.motor_asyncio import AsyncIOMotorClient
# import asyncio

# # Create Flask app
# app = Flask(__name__)

# # MongoDB connection string (hardcoded)
# MONGO_URI = "mongodb+srv://thperera2000:lFH4uWJYrEgCQxKD@cluster0.brak3.mongodb.net/"
# DATABASE_NAME = "interaction_tracking"
# COLLECTION_NAME = "button_interactions"

# # Pydantic model for validation
# class ClickCoordinates(BaseModel):
#     x: float
#     y: float

# class InteractionData(BaseModel):
#     user_id: str
#     button_id: str
#     click_coordinates: ClickCoordinates
#     missed_click_distance: float = Field(default=0)
#     is_miss_click: bool = Field(default=False)
#     session_duration: int
#     device: str
#     timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

# # MongoDB client
# class MongoDB:
#     _client = None
#     _db = None
#     _collection = None

#     @classmethod
#     def get_client(cls):
#         if not cls._client:
#             cls._client = AsyncIOMotorClient(MONGO_URI)
#             cls._db = cls._client[DATABASE_NAME]
#             cls._collection = cls._db[COLLECTION_NAME]
#         return cls._collection

#     @classmethod
#     async def insert_data(cls, data: dict):
#         collection = cls.get_client()
#         result = await collection.insert_one(data)
#         return result.inserted_id

# # Function to handle async MongoDB insertion in a separate thread
# def insert_data_async(data):
#     loop = asyncio.new_event_loop()
#     asyncio.set_event_loop(loop)
#     result = loop.run_until_complete(MongoDB.insert_data(data))
#     loop.close()
#     return result

# # Route to track interactions
# @app.route("/track_interaction", methods=["POST"])
# def track_interaction():
#     try:
#         # Parse JSON request data
#         data = request.get_json()
#         interaction_data = InteractionData(**data)

#         # Insert data asynchronously (in a separate thread)
#         threading.Thread(target=insert_data_async, args=(data,)).start()

#         return jsonify({"message": "Interaction tracked successfully"}), 200

#     except Exception as e:
#         return jsonify({"error": str(e)}), 400

# if __name__ == '__main__':
#     app.run(debug=True, host="0.0.0.0", port=8000)



# from flask import Flask, request, jsonify
# from pymongo import MongoClient
# from datetime import datetime

# # Create Flask app
# app = Flask(__name__)

# # MongoDB connection string (hardcoded)
# MONGO_URI = "mongodb+srv://agrisync:55e3QB2Hgn2yLTtD@cluster0.zm87w.mongodb.net/"
# DATABASE_NAME = "interaction_tracking"
# COLLECTION_NAME = "button_interactions"

# # Create synchronous MongoDB client
# client = MongoClient(MONGO_URI)
# db = client[DATABASE_NAME]
# collection = db[COLLECTION_NAME]

# @app.route('/track_interaction', methods=['POST'])
# def track_interaction():
#     try:
#         print("Received request to track interaction.")
#         data = request.get_json()
#         print(data)
#         # Process data and insert into MongoDB
#         result = collection.insert_one(data)
#         return jsonify({"status": "success", "inserted_id": str(result.inserted_id)}), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True, host="0.0.0.0", port=8000)


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