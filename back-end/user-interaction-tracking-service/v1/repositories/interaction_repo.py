from pymongo import MongoClient
import certifi
import logging
from config import MONGO_URI, DATABASE_NAME, COLLECTION_NAME

class InteractionRepository:
    def __init__(self):
        # Use certifi's CA certificates for SSL verification
        self.client = MongoClient(
            MONGO_URI,
            tls=True,
            tlsCAFile=certifi.where()
        )
        self.db = self.client[DATABASE_NAME]
        self.collection = self.db[COLLECTION_NAME]
        
        # Verify connection on initialization
        try:
            self.client.admin.command('ping')
            logging.info("Successfully connected to MongoDB")
        except Exception as e:
            logging.error(f"Failed to connect to MongoDB: {str(e)}")
            raise

    def save_interaction(self, interaction):
        try:
            result = self.collection.insert_one(interaction.to_dict())
            logging.info(f"Interaction saved: {interaction.button_id} for user {interaction.user_id} with _id: {result.inserted_id}")
            return result.inserted_id
        except Exception as e:
            logging.error(f"Error saving interaction: {str(e)}")
            raise

    def get_interactions(self, user_id):
        try:
            interactions = list(self.collection.find({'user_id': user_id}))
            logging.info(f"Retrieved {len(interactions)} interactions for user {user_id}")
            return interactions
        except Exception as e:
            logging.error(f"Error retrieving interactions: {str(e)}")
            raise

    def __del__(self):
        try:
            self.client.close()
        except:
            pass