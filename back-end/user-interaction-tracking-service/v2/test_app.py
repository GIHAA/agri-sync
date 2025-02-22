import unittest
import json
from app import app  # Import the Flask app
from unittest.mock import patch, MagicMock

class TestFlaskAPI(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """Initialize class-level mock interaction data for tests.
        
        Sets up a mock interaction dictionary used across the test suite to simulate a
        user interaction. The dictionary includes a button identifier, touch point
        coordinates, button bounds dimensions, device metrics, and a flag indicating
        whether the click is a miss click.
        """
        cls.mock_interaction = {
            "buttonId": "test_button_123",
            "touchPoint": {"x": 150, "y": 250},
            "buttonBounds": {"x": 100, "y": 200, "width": 50, "height": 30},
            "deviceMetrics": {"screenWidth": 1080, "screenHeight": 1920},
            "isMissClick": False
        }

    def setUp(self):
        """
        Initializes a Flask test client for API testing.
        
        This method creates a test client from the Flask application instance, allowing tests
        to simulate HTTP requests to various API endpoints.
        """
        self.client = app.test_client()

    def test_model_status(self):
        """
        Tests the /api/model-status endpoint.
        
        Sends a GET request to the endpoint and verifies that the response status is 200
        and that the returned JSON payload includes a 'status' key.
        """
        response = self.client.get('/api/model-status')
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 200)
        self.assertIn('status', data)

    def test_save_touch_interaction(self):
        """
        Verifies that the /api/touch-interactions endpoint saves a touch interaction.
        
        Sends a POST request with a sample interaction payload and asserts that the response
        has a 201 status code and includes a JSON message confirming the interaction was saved.
        """
        response = self.client.post('/api/touch-interactions', json=self.mock_interaction)
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 201)
        self.assertIn('message', data)
        self.assertEqual(data['message'], 'Interaction saved')

    def test_save_bulk_touch_interactions(self):
        """
        Tests the bulk touch interactions endpoint with valid input.
        
        Sends a POST request to '/api/bulk-touch-interactions' with a list of valid touch
        interaction objects and verifies that the response has a 201 status code and a JSON
        body containing a 'message' key with the value 'Bulk interactions saved successfully'.
        """
        bulk_data = [self.mock_interaction, self.mock_interaction]

        response = self.client.post('/api/bulk-touch-interactions', json=bulk_data)
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 201)
        self.assertIn('message', data)
        self.assertEqual(data['message'], 'Bulk interactions saved successfully')

    def test_save_bulk_touch_interactions_invalid_format(self):
        """
        Test invalid JSON payload on /api/bulk-touch-interactions endpoint.
        
        Sends a POST request with a non-array JSON payload and verifies that the response
        returns a 400 status code with an error message indicating that the request body
        must be an array.
        """
        response = self.client.post('/api/bulk-touch-interactions', json={"invalid": "data"})
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 400)
        self.assertIn('error', data)
        self.assertEqual(data['error'], 'Request body must be an array')

    @patch('app.ml_model.train_model', return_value=MagicMock(history={'loss': [0.1], 'val_loss': [0.2]}))
    def test_train_model(self, mock_train):
        """
        Tests the /api/train endpoint for model training.
        
        Sends a POST request with a sample button ID and verifies that the response has a
        400 status code with an 'error' key in its JSON content.
        """
        response = self.client.post('/api/train', json={"buttonId": "test_button_123"})
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 400)  # Adjust based on real DB behavior
        self.assertIn('error', data)

    def test_predict(self):
        """
        Tests the /api/predict endpoint using valid metrics.
        
        Sends a POST request with valid metric values and asserts that a 500 status code is returned along with a response that includes an 'error' key, indicating the model may not be initialized.
        """
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
        """
        Test the button recommendations endpoint for a non-existent button ID.
        
        Sends a GET request to the /api/button-recommendations/<button_id> endpoint using a test button ID and verifies that the response includes an 'error' key and returns a 404 status code.
        """
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
