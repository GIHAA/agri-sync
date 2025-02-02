# import unittest
# from unittest.mock import patch, MagicMock
# from app import app, processor

# class TestSeedDataProcessor(unittest.TestCase):
#     def setUp(self):
#         # Set up the Flask test client
#         self.client = app.test_client()
#         self.client.testing = True

#     @patch('app.SeedDataProcessor.query_seed_data')
#     def test_query_seed_valid(self, mock_query_seed_data):
#         """
#         Test querying the `/query` endpoint with valid input.
#         """
#         # Mock the response from the query_seed_data method
#         mock_query_seed_data.return_value = "Mocked response for valid query."

#         # Prepare a valid query payload
#         payload = {"query": "What are the best seeds for tomatoes?"}

#         # Send POST request to /query
#         response = self.client.post('/query', json=payload)

#         # Assert the response
#         self.assertEqual(response.status_code, 200)
#         self.assertIn("result", response.json)
#         self.assertEqual(response.json["result"], "Mocked response for valid query.")

#     def test_query_seed_missing_query(self):
#         """
#         Test querying the `/query` endpoint without a query parameter.
#         """
#         # Send POST request with missing `query` parameter
#         response = self.client.post('/query', json={})

#         # Assert the response
#         self.assertEqual(response.status_code, 400)
#         self.assertIn("error", response.json)
#         self.assertEqual(response.json["error"], "Query parameter is required.")

#     @patch('app.SeedDataProcessor.query_seed_data')
#     def test_query_seed_error_handling(self, mock_query_seed_data):
#         """
#         Test error handling when `query_seed_data` raises an exception.
#         """
#         # Mock an exception being raised
#         mock_query_seed_data.side_effect = Exception("Mocked exception.")

#         # Send POST request to /query
#         payload = {"query": "What are the best seeds for wheat?"}
#         response = self.client.post('/query', json=payload)

#         # Assert the response
#         self.assertEqual(response.status_code, 500)
#         self.assertIn("error", response.json)
#         self.assertEqual(response.json["error"], "Mocked exception.")

#     @patch('app.Pinecone.Index')
#     @patch('app.ChatOpenAI')
#     @patch('app.LangchainPinecone')
#     def test_processor_initialization(self, mock_langchain_pinecone, mock_chat_openai, mock_pinecone_index):
#         """
#         Test the initialization of the SeedDataProcessor.
#         """
#         # Mock Pinecone index creation and LangChain Pinecone initialization
#         mock_pinecone_index.return_value.list_indexes.return_value = ["mock-index"]
#         mock_langchain_pinecone.from_existing_index.return_value = MagicMock()
#         mock_chat_openai.return_value = MagicMock()

#         processor_mock = processor  # Reuse the processor instance for testing
#         self.assertIsNotNone(processor_mock)

# if __name__ == "__main__":
#     unittest.main()
