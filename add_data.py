import chromadb
from chromadb.config import Settings

# Initialize ChromaDB client
chroma_client = chromadb.Client(Settings(
    chroma_db_impl="duckdb+parquet",
    persist_directory="db"
))

# Get or create collection
collection = chroma_client.get_or_create_collection(
    name="qa_collection",
    metadata={"hnsw:space": "cosine"}
)

# Add some sample documents
documents = [
    "The company was founded in 2010 and specializes in AI technology.",
    "Our main product is an AI assistant that helps with customer support.",
    "The headquarters is located in San Francisco, California.",
    "We have over 100 employees working in various departments.",
    "Our AI system uses machine learning to improve over time."
]

# Add documents to collection
collection.add(
    documents=documents,
    ids=[f"doc{i}" for i in range(len(documents))]
)

print("✅ Documents added to ChromaDB successfully!") 