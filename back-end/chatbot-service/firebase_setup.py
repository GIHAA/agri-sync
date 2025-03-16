import firebase_admin
from firebase_admin import credentials, storage
import os

def initialize_firebase():
    # Load Firebase storage bucket from environment variable
    storage_bucket = os.getenv("FIREBASE_STORAGE_BUCKET")
    
    if not storage_bucket:
        raise ValueError("FIREBASE_STORAGE_BUCKET environment variable is not set.")

    # Path to the service account key
    service_account_path = "config/serviceAccountKey.json"
    
    # Set GOOGLE_APPLICATION_CREDENTIALS for Google Cloud Storage
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = service_account_path

    # Load the service account credentials
    cred = credentials.Certificate(service_account_path)

    # Initialize Firebase Admin SDK
    firebase_admin.initialize_app(cred, {'storageBucket': storage_bucket})

    print(f"Firebase Admin SDK Initialized with bucket: {storage_bucket}")
    

# Initialize Firebase
initialize_firebase()
