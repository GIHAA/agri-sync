from pymongo import MongoClient
from config import MONGO_URI
import logging

def get_mongo_client():
    try:
        client = MongoClient(MONGO_URI)
        return client
    except Exception as e:
        logging.error(f"MongoDB connection error: {e}")
        return None
