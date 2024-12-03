from pymongo import MongoClient
from config import MONGO_URI, DATABASE_NAME, COLLECTION_NAME
import logging

class InteractionRepository:
    def __init__(self):
        self.client = MongoClient(MONGO_URI)
        self.db = self.client[DATABASE_NAME]
        self.collection = self.db[COLLECTION_NAME]

    def save_interaction(self, interaction):
        try:
            # Insert interaction into MongoDB
            self.collection.insert_one(interaction.to_dict())
            logging.info(f"Interaction saved: {interaction.button_id} for user {interaction.user_id}")
        except Exception as e:
            logging.error(f"Error saving interaction: {str(e)}")
            raise

    def get_interactions(self, user_id):
        try:
            # Retrieve interactions by user_id
            interactions = list(self.collection.find({'user_id': user_id}))
            return interactions
        except Exception as e:
            logging.error(f"Error retrieving interactions: {str(e)}")
            raise
