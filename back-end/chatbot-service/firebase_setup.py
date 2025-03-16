import firebase_admin
from firebase_admin import credentials, storage
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def initialize_firebase():
    # Load Firebase storage bucket from environment variable
    storage_bucket = os.getenv("FIREBASE_STORAGE_BUCKET")
    
    if not storage_bucket:
        raise ValueError("FIREBASE_STORAGE_BUCKET environment variable is not set.")

    # Load the service account key from the environment variable
    service_account_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

    if not service_account_path or not os.path.exists(service_account_path):
        raise FileNotFoundError(f"Service account key not found at: {service_account_path}")

    # Load the service account credentials
    cred = credentials.Certificate(service_account_path)

    # Initialize Firebase Admin SDK
    firebase_admin.initialize_app(cred, {'storageBucket': storage_bucket})

    print(f"Firebase Admin SDK Initialized with bucket: {storage_bucket}")
    

# Initialize Firebase
initialize_firebase()

