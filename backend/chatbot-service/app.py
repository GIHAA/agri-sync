import os
import json
import re
from dotenv import load_dotenv
from pymongo import MongoClient
from langchain_openai import ChatOpenAI
from langchain.schema import AIMessage

# Load environment variables from .env file
load_dotenv()

class MongoDBQueryProcessor:
    def __init__(self, mongo_uri: str = None, database_name: str = "test", openai_api_key: str = None):
        """
        Initialize the MongoDB Query Processor with MongoDB URI and OpenAI API key.
        """
        # Validate MongoDB URI
        if not mongo_uri:
            mongo_uri = os.getenv('MONGO_URI')
        
        if not mongo_uri:
            raise ValueError(
                "MongoDB URI is required. "
                "Please set it in the .env file or environment variables."
            )
        
        # Validate OpenAI API Key
        if not openai_api_key:
            openai_api_key = os.getenv('OPENAI_API_KEY')
        
        if not openai_api_key:
            raise ValueError(
                "OpenAI API key is required. "
                "Please set it in the .env file or environment variables."
            )
        
        # Set OpenAI API Key
        os.environ['OPENAI_API_KEY'] = openai_api_key

        # Initialize OpenAI LLM
        self.llm = ChatOpenAI(
            model="gpt-3.5-turbo",
            temperature=0.2,
            max_tokens=100
        )

        # Initialize MongoDB client
        self.client = MongoClient(mongo_uri)
        self.database = self.client[database_name]
        print(f"Connected to MongoDB database: {database_name}")

    def interpret_query(self, user_query: str) -> dict:
        """
        Interpret user query to dynamically create a MongoDB aggregation query.
        
        Args:
            user_query (str): User's natural language query.
        
        Returns:
            dict: MongoDB query based on the user's request.
        """
        prompt = f"""
        You are an expert MongoDB query generator. Please interpret the following user query and generate a valid MongoDB query.

        The collection stores planting data with the following structure:
        {{
            "_id": "60b5f96c9d29b82879fbd1e6",
            "location": {{
                "latitude": 7.8731,
                "longitude": 80.7718,
                "address": "Kurunegala, Sri Lanka"
            }},
            "seed": {{
                "name": "Chili",
                "category": "Spice"
            }},
            "planted_qty": 250,
            "plantedAt": "2024-11-16T12:00:00Z",
            "farmer": {{
                "name": "Nathan Perera"
            }}
        }}

        Query: "{user_query}"

        Please generate the MongoDB aggregation query in JSON format. If the query mentions comparing quantities or sums, make sure the query groups by the relevant field (like seed.name) and aggregates using the appropriate operation (e.g., sum, max, min). Ensure to use the correct collection and return the most relevant document.
        """
        
        # Get the response from LLM (a MongoDB query generation prompt)
        response = self.llm.invoke(prompt)  # Ensure the response is the raw content
        
        # Print the raw response for debugging purposes
        print(f"LLM Response: {response}")
        
        try:
            # Handle the response assuming it might be in an AIMessage format
            if isinstance(response, AIMessage):
                raw_content = response.content
            else:
                raw_content = response  # Handle as a plain string

            # Fix the response to use double quotes for JSON keys and values
            raw_content = raw_content.replace("'", '"')

            # Try parsing the fixed response as valid JSON
            mongo_query = json.loads(raw_content)
            
            # Modify the query dynamically based on field detection
            if "aggregate" in mongo_query:
                mongo_query["aggregate"] = "planting_data"  # Ensure aggregate uses the correct collection
                    
                # Look for field and aggregation type based on user query
                aggregation_field = "$seed.name"  # Default aggregation field
                aggregation_type = "$sum"  # Default aggregation operation is sum
                sort_order = -1  # Default sort order (descending)
                    
                if "planted_qty" in user_query.lower():
                    aggregation_field = "$planted_qty"
                    aggregation_type = "$sum"  # Summing quantities
                elif "seed" in user_query.lower():
                    aggregation_field = "$seed.name"
                    aggregation_type = "$sum"  # Summing planted quantities per seed
                elif "category" in user_query.lower():
                    aggregation_field = "$seed.category"
                    aggregation_type = "$sum"  # Summing quantities per category

                # Handle aggregation based on the user's request (e.g., max, min)
                if "max" in user_query.lower():
                    aggregation_type = "$max"
                elif "min" in user_query.lower():
                    aggregation_type = "$min"
                    
                # Construct aggregation pipeline dynamically
                mongo_query["pipeline"] = [
                    { 
                        "$group": { 
                            "_id": aggregation_field,  # Dynamically group by the detected field
                            "aggregated_value": { aggregation_type: aggregation_field }  # Dynamic aggregation type
                        }
                    },
                    { 
                        "$sort": { "aggregated_value": sort_order }  # Sort based on aggregation value
                    },
                    { 
                        "$limit": 1  # Return the top result
                    }
                ]
                
            if "collection" not in mongo_query:  # If the collection is not provided, add it
                mongo_query["collection"] = "planting_data"
                
            print(f"Generated MongoDB Query: {mongo_query}")
            return mongo_query
        except json.JSONDecodeError as e:
            # If response is not valid JSON, print error and return failure
            print(f"Error parsing response as JSON: {e}")
            return {"error": f"Could not parse the query: {raw_content}"}
        except Exception as e:
            # Handle unexpected errors
            print(f"Unexpected error interpreting query: {e}")
            return {"error": str(e)}


    def execute_query(self, collection_name: str, query: dict):
        """
        Execute the interpreted MongoDB query.
        
        Args:
            collection_name (str): Name of the MongoDB collection to query.
            query (dict): MongoDB query object.
        
        Returns:
            list: Query results.
        """
        if not collection_name:
            raise ValueError("Collection name is required to execute the query.")
        
        collection = self.database[collection_name]
        results = list(collection.find(query))
        print(f"Query executed. Retrieved {len(results)} documents.")
        return results

    def generate_response(self, query_results: list, user_query: str) -> str:
        """
        Use LLM to generate a human-friendly response based on query results.
        
        Args:
            query_results (list): Results from the MongoDB query.
            user_query (str): Original user query.
        
        Returns:
            str: LLM-generated response.
        """
        prompt = f"""
        The user asked: "{user_query}"

        The MongoDB query returned the following results:
        {query_results}

        Write a concise, user-friendly response summarizing the results. 
        If no results are found, politely inform the user.
        """
        response = self.llm.invoke(prompt)  # Use invoke instead of predict
        return response

    def process_query(self, user_query: str):
        """
        Process the user query end-to-end: interpret, execute, and respond.
        
        Args:
            user_query (str): User's natural language query.
        
        Returns:
            str: Human-friendly response generated by LLM.
        """
        # Interpret user query
        interpreted_query = self.interpret_query(user_query)
        
        # Check for errors in query interpretation
        if "error" in interpreted_query:
            return f"Error interpreting query: {interpreted_query['error']}"
        
        # Extract collection name and query filter
        collection_name = interpreted_query.get("collection", "planting_data")  # Default to planting_data
        query_filter = interpreted_query.get("filter", {})
        
        if not collection_name:
            return "Error: The interpreted query did not include a collection name."

        # Execute the query on MongoDB
        query_results = self.execute_query(collection_name, query_filter)

        # Log raw query and results for debugging
        print(f"Raw MongoDB Query: {json.dumps(query_filter, indent=2)}")
        print(f"Query Results: {json.dumps(query_results, indent=2)}")
        
        # Generate and return the final response
        final_response = self.generate_response(query_results, user_query)
        return final_response



def main():
    # Load environment variables and initialize the processor
    try:
        processor = MongoDBQueryProcessor(
            mongo_uri=os.getenv("MONGO_URI"),
            database_name="seed_data",  # Example database
            openai_api_key=os.getenv("OPENAI_API_KEY")
        )
        
        # Example user queries
        user_queries = [
            "What are the most commonly planted seeds ?"
        ]
        
        for query in user_queries:
            print(f"\nUser Query: {query}")
            response = processor.process_query(query)
            print(f"Response: {response}")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
