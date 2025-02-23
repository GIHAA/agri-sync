import unittest
import json
from app import app  # Import the Flask app
from unittest.mock import patch, MagicMock

class TestFlaskAPI(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """ Setup code before tests run. """
        cls.mock_interaction = {
            "buttonId": "test_button_123",
            "touchPoint": {"x": 150, "y": 250},
            "buttonBounds": {"x": 100, "y": 200, "width": 50, "height": 30},
            "deviceMetrics": {"screenWidth": 1080, "screenHeight": 1920},
            "isMissClick": False
        }

    def setUp(self):
        """ Setup code before each test. """
        self.client = app.test_client()

    def test_model_status(self):
        """ Test the /api/model-status endpoint. """
        response = self.client.get('/api/model-status')
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 200)
        self.assertIn('status', data)

    def test_save_touch_interaction(self):
        """ Test the /api/touch-interactions endpoint to save a touch interaction. """
        response = self.client.post('/api/touch-interactions', json=self.mock_interaction)
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 201)
        self.assertIn('message', data)
        self.assertEqual(data['message'], 'Interaction saved')

    def test_save_bulk_touch_interactions(self):
        """ Test the /api/bulk-touch-interactions endpoint with valid data. """
        bulk_data = [self.mock_interaction, self.mock_interaction]

        response = self.client.post('/api/bulk-touch-interactions', json=bulk_data)
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 201)
        self.assertIn('message', data)
        self.assertEqual(data['message'], 'Bulk interactions saved successfully')

    def test_save_bulk_touch_interactions_invalid_format(self):
        """ Test /api/bulk-touch-interactions with incorrect request format. """
        response = self.client.post('/api/bulk-touch-interactions', json={"invalid": "data"})
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 400)
        self.assertIn('error', data)
        self.assertEqual(data['error'], 'Request body must be an array')

    @patch('app.ml_model.train_model', return_value=MagicMock(history={'loss': [0.1], 'val_loss': [0.2]}))
    def test_train_model(self, mock_train):
        """ Test the /api/train endpoint for model training. """
        response = self.client.post('/api/train', json={"buttonId": "test_button_123"})
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 400)  # Adjust based on real DB behavior
        self.assertIn('error', data)

    def test_predict(self):
        """ Test the /api/predict endpoint. """
        valid_metrics = {
            "x": 100, "y": 200,
            "width": 50, "height": 30,
            "screenWidth": 1080, "screenHeight": 1920
        }

        response = self.client.post('/api/predict', json={"metrics": valid_metrics})
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 500)  # Model may not be initialized
        self.assertIn('error', data)

    def test_button_recommendations(self):
        """ Test the /api/button-recommendations/<button_id> endpoint. """
        response = self.client.get('/api/button-recommendations/test_button_123')
        data = json.loads(response.data)

        self.assertIn('error', data)
        self.assertEqual(response.status_code, 404)  # Adjust based on DB data availability

    def test_invalid_url(self):
        """ Test an invalid URL. """
        response = self.client.get('/invalid')
        self.assertEqual(response.status_code, 404)

    @classmethod
    def tearDownClass(cls):
        """ Cleanup after all tests have run. """
        pass  # Any necessary cleanup (DB teardown, etc.)

if __name__ == '__main__':
    unittest.main()
