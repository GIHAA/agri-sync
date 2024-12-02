import unittest
import json
from app import app  # Import the Flask app from the app.py file
import pickle
import pandas as pd
from io import BytesIO

class TestFlaskApp(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """ Setup code before tests run. """
        # Create mock data
        cls.mock_data = {
            "whenToPlant": "2024-03-15",
            "whatToPlant": "Carrot"
        }

        # Load the model and encoders used in the predict endpoint
        cls.model = pickle.load(open("price_model.pkl", "rb"))
        cls.label_encoder_veg = pickle.load(open("label_encoder_veg.pkl", "rb"))
        cls.label_encoder_month = pickle.load(open("label_encoder_month.pkl", "rb"))
    
    def setUp(self):
        """ Setup code before each test. """
        self.client = app.test_client()

    def test_predict_valid_request(self):
        """ Test the /predict endpoint with a valid request. """
        response = self.client.post('/predict', json=self.mock_data)
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 200)
        self.assertTrue(data['success'])
        self.assertIn('predicted_price', data['data'])

    def test_predict_invalid_whenToPlant(self):
        """ Test the /predict endpoint with an invalid 'whenToPlant' date format. """
        invalid_data = self.mock_data.copy()
        invalid_data['whenToPlant'] = 'invalid-date'

        response = self.client.post('/predict', json=invalid_data)
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 400)
        self.assertFalse(data['success'])
        self.assertIn("Invalid 'whenToPlant' format", data['message'])

    def test_predict_missing_whatToPlant(self):
        """ Test the /predict endpoint with a missing 'whatToPlant'. """
        invalid_data = self.mock_data.copy()
        invalid_data['whatToPlant'] = ''

        response = self.client.post('/predict', json=invalid_data)
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 400)
        self.assertFalse(data['success'])
        self.assertIn("'whatToPlant' is required", data['message'])

    def test_options(self):
        """ Test the /options endpoint to get available years, months, and vegetables. """
        response = self.client.get('/options')
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 200)
        self.assertTrue(data['success'])
        self.assertIn('years', data['data'])
        self.assertIn('months', data['data'])
        self.assertIn('vegetables', data['data'])

    def test_invalid_url(self):
        """ Test an invalid URL. """
        response = self.client.get('/invalid')
        self.assertEqual(response.status_code, 404)

    @classmethod
    def tearDownClass(cls):
        """ Cleanup after all tests have run. """
        pass  # Add any necessary cleanup here (e.g., closing files, DB connections)


if __name__ == '__main__':
    unittest.main()
