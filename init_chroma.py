import chromadb
import json
import os

# Initialize ChromaDB client
chroma_client = chromadb.PersistentClient(path="db")

# Create or get collection
collection = chroma_client.create_collection(
    name="thena_chunks",
    metadata={"hnsw:space": "cosine"}
)

# Load your data
with open("thena_chunks.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Prepare documents and IDs
documents = [item["text"] for item in data]
ids = [item["id"] for item in data]

# Add documents to collection
collection.add(
    documents=documents,
    ids=ids
)

print("✅ Successfully initialized ChromaDB with your data!")
print(f"Added {len(documents)} documents to the 'thena_chunks' collection") 