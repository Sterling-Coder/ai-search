# langgraph_agent.py

def rag_agent(question: str) -> str:
    # TEMP MOCK: Replace this with real LangGraph RAG logic later
    if "ticket" in question.lower():
        return "To create a ticket:\n1. Go to Help Center\n2. Click 'Create Ticket'\n3. Fill details\n4. Submit"
    elif "complaint" in question.lower():
        return "To raise a complaint:\n1. Visit Support\n2. Choose 'Raise a Complaint'\n3. Submit your issue"
    else:
        return "Sorry, I don’t have a guide for that yet."