import os
from dotenv import load_dotenv
import json
from typing import List, Dict
import pinecone
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone, ServerlessSpec
from langchain_community.vectorstores import Pinecone as LangchainPinecone
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Load environment variables from .env file
load_dotenv()

class SeedDataProcessor:
    def __init__(self, 
             data_directory: str = "data",
             pinecone_api_key: str = None,
             openai_api_key: str = None,
             pinecone_index_name: str = "chatbot-index"):
        """
        Initialize the seed data processor with local JSON data and Pinecone configurations.
        """
        # Validate Pinecone API Key
        if not pinecone_api_key:
            pinecone_api_key = os.getenv('PINECONE_API_KEY')
        
        if not pinecone_api_key:
            raise ValueError(
                "Pinecone API key is required. "
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
        
        # Data Directory
        self.data_directory = data_directory
        
        # Embedding Model
        self.embedding_model = OpenAIEmbeddings()
        
        # Store the Pinecone index name
        self.pinecone_index_name = pinecone_index_name
        
        # Initialize Pinecone client
        self.pinecone_client = Pinecone(api_key=pinecone_api_key)

        # Pinecone Setup
        try:
            # Check if the index exists, create if it doesn't
            if self.pinecone_index_name not in self.pinecone_client.list_indexes().names():
                print(f"Creating new index: {self.pinecone_index_name}")
                self.pinecone_client.create_index(
                    name=self.pinecone_index_name,
                    dimension=1536,  # OpenAI embedding dimension
                    metric='cosine',
                    spec=ServerlessSpec(
                        cloud='aws',
                        region='us-east-1'
                    )
                )

            # Connect to the existing or newly created index
            self.pinecone_index = self.pinecone_client.Index(self.pinecone_index_name)
            
            # Create PineconeVectorStore
            self.vector_store = LangchainPinecone.from_existing_index(
                index_name=self.pinecone_index_name,
                embedding=self.embedding_model
            )

        except Exception as e:
            print(f"Error initializing Pinecone: {e}")
            raise

        # Set OpenAI API Key
        os.environ['OPENAI_API_KEY'] = openai_api_key

    def read_doc(self, directory):
        """
        Load all PDF documents from the specified directory.
        """
        file_loader = PyPDFDirectoryLoader(directory)
        documents = file_loader.load()
        return documents

    def chunk_data(self, docs, chunk_size=800, chunk_overlap=50):
        """
        Split documents into smaller chunks based on the specified chunk size and overlap.
        """
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
        chunks = text_splitter.split_documents(docs)
        return chunks

    def embed_and_store_data(self, documents):
        """
        Embed documents and store them in Pinecone.
        
        Args:
            documents (List[Dict]): List of seed documents
        """
        if not documents:
            print("No documents to embed and store.")
            return

        try:
            # Clear existing data in the index
            self.pinecone_client.Index(self.pinecone_index_name).delete(delete_all=True)
            print("Cleared the existing index.")
        except Exception as e:
            print(f"Error clearing Pinecone index: {e}")

        # Add documents to the vector store
        texts = []
        metadatas = []
        for doc in documents:
            # Create a comprehensive text representation
            text = doc.page_content  # Assuming page_content holds the extracted text
            
            # Create metadata with the full text
            metadata = {
                "source": doc.metadata.get('source', 'Unknown'),
                "full_text": text
            }

            texts.append(text)
            metadatas.append(metadata)

        # Use Langchain's add_texts method
        LangchainPinecone.from_texts(
            texts=texts, 
            embedding=self.embedding_model, 
            index_name=self.pinecone_index_name,
            metadatas=metadatas
        )

        print(f"Embedded and stored {len(documents)} documents in Pinecone")


    def query_seed_data(self, query: str):
        """
        Query the seed database.
        
        Args:
            query (str): User's query about seeds
        
        Returns:
            str: Comprehensive answer
        """
        try:
            qa_chain = self.create_retrieval_chain()
            
            # First, retrieve the context documents
            retrieved_docs = self.vector_store.similarity_search(query, k=5)
            print("\n--- Retrieved Documents ---")
            for i, doc in enumerate(retrieved_docs, 1):
                print(f"Document {i}:")
                print(f"Content: {doc.page_content}")
                print(f"Metadata: {doc.metadata}\n")
            
            # Then run the query
            result = qa_chain({"query": query})
            return result['result']
        except Exception as e:
            print(f"Error querying seed data: {e}")
            return "Sorry, I couldn't retrieve an answer at this moment."

    def create_retrieval_chain(self):
        """
        Create a LangChain retrieval and query system.
        
        Returns:
            Runnable chain for querying
        """
        # Create the RetrievalQA chain
        retriever = self.vector_store.as_retriever(
            search_kwargs={
                "k": 5  # Increase number of retrieved documents
            }
        )
        
        prompt_template = PromptTemplate(
            template="""You are an expert seed and agricultural database assistant. 
            Use the following context to provide a comprehensive and precise answer to the question.
            If the context does not contain sufficient information, state that clearly.

            Context:
            {context}

            Question: {question}

            Helpful and Detailed Answer:""",
            input_variables=["context", "question"]
        )
        
        llm = ChatOpenAI(
            model="gpt-3.5-turbo", 
            temperature=0.2,
            max_tokens=100  # Increase max token output
        )
        
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=retriever,
            chain_type_kwargs={
                "prompt": prompt_template,
                "verbose": True  # Enable verbose mode for debugging
            }
        )
        
        return qa_chain

def main():
    # Initialize processor with local data directory
    try:
        processor = SeedDataProcessor(data_directory="documents")
        
        # Fetch data from PDF files
        pdf_documents = processor.read_doc('data/')
        print(f"Total PDF documents loaded: {len(pdf_documents)}")
        
        # Chunk the documents into smaller pieces
        chunked_documents = processor.chunk_data(docs=pdf_documents)
        print(f"Total chunks created: {len(chunked_documents)}")
        
        # Embed and store in Pinecone
        processor.embed_and_store_data(chunked_documents)
        
        # Example queries
        queries = [
            "How have climate change and land degradation impacted the agricultural sector in Sri Lanka, and what measures have been taken by the government to address these challenges?",
            "What role do traditional farming methods and the adoption of modern agricultural technologies play in Sri Lanka's agricultural productivity, and how can the government facilitate the transition to more efficient practices?",
            "In what ways does the diversity of Sri Lanka's agricultural products, such as rice, tea, and coconut, contribute to the nation's economy, and what are the potential risks and benefits of focusing on sustainable agricultural practices??"
        ]
        
        for query in queries:
            print(f"\nQuery: {query}")
            result = processor.query_seed_data(query)
            print(f"Answer: {result}")
    
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()