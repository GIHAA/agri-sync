import os
import urllib.parse

# MongoDB Atlas connection details
MONGO_USERNAME = "agrisync"
MONGO_PASSWORD = urllib.parse.quote_plus("55e3QB2Hgn2yLTtD")
MONGO_CLUSTER = "cluster0.zm87w.mongodb.net"
MONGO_URI = f"mongodb+srv://{MONGO_USERNAME}:{MONGO_PASSWORD}@{MONGO_CLUSTER}/?retryWrites=true&w=majority"
DATABASE_NAME = "interaction_tracking"
COLLECTION_NAME = "button_interactions"
