import json
import os
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_core.runnables import RunnableLambda, RunnableSequence
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import chromadb

try:
    # Get the directory where the script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    env_path = os.path.join(script_dir, 'api.env')

    # Load environment variables from the correct path
    load_dotenv(env_path)

    # Check if API key exists and set it explicitly
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("Please set OPENAI_API_KEY in your api.env file")
    
    os.environ["OPENAI_API_KEY"] = api_key

    # Load your Thena chunks
    try:
        chunks_path = os.path.join(script_dir, 'thena_chunks.json')
        with open(chunks_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        documents = [chunk["text"] for chunk in data]
    except FileNotFoundError:
        print("Error: thena_chunks.json file not found. Please create this file with your data.")
        documents = []

    # Embedding
    embedding = OpenAIEmbeddings(openai_api_key=api_key)

    # Set up ChromaDB client and persistent directory
    persist_directory = os.path.join(script_dir, 'chroma_db')
    
    # Vector DB: Create Chroma DB with persistence
    if documents:
        vectordb = Chroma.from_texts(
            texts=documents,
            embedding=embedding,
            persist_directory=persist_directory
        )
        vectordb.persist()  # Save the database to disk
        retriever = vectordb.as_retriever(
            search_kwargs={"k": 3}  # Return top 3 most relevant chunks
        )
    else:
        retriever = None

    # Prompt Template
    template = """
    You are a helpful assistant for Thena.ai. Use the following context to answer the question.
    If you don't know the answer, say "I don't know."

    Context:
    {context}

    Question:
    {question}

    Answer:
    """

    prompt = PromptTemplate(
        input_variables=["context", "question"],
        template=template,
    )

    # LangGraph-style RAG pipeline
    def rag_pipeline(question: str):
        if not retriever:
            return "Error: No data available. Please ensure thena_chunks.json exists with valid data."
            
        try:
            # 1. Retrieve
            docs = retriever.get_relevant_documents(question)
            context = "\n\n".join(doc.page_content for doc in docs)

            # 2. Prompt formatting
            formatted_prompt = prompt.format(context=context, question=question)

            # 3. Answer using OpenAI Chat
            llm = ChatOpenAI(temperature=0, openai_api_key=api_key)
            response = llm.invoke(formatted_prompt)
            return response.content
        except Exception as e:
            return f"An error occurred while processing your question: {str(e)}"

    # Example usage
    if __name__ == "__main__":
        while True:
            query = input("Ask something about Thena.ai: ")
            if query.lower() in ["exit", "quit"]:
                break
            answer = rag_pipeline(query)
            print(f"\n🧠 Answer:\n{answer}\n")

except Exception as e:
    print(f"An error occurred: {str(e)}")
    raise