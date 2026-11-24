from langchain_community.llms import Ollama
from langchain_core.prompts import PromptTemplate

# Initialize Ollama to connect to the local instance
llm = Ollama(model="llama3.2:3b", base_url="http://localhost:11434")

PROMPT_TEMPLATE = """You are an expert Mine, Oil, and Gas Safety Assistant.

Context information from approved safety manuals is below.
---------------------
{context}
---------------------

Question: {question}

Instructions:
- First, try to answer the question using ONLY the provided context.
- If the context does not contain the answer, you may use your internal knowledge to answer, BUT ONLY if the question is strictly related to mining, oil, gas, or heavy industrial safety.
- If the question is not found in the context AND is NOT related to mining, oil, or gas, decline to answer and say "I can only answer questions related to mining, oil, and gas."
- Provide a clear, professional answer.

Answer:
"""

def generate_answer(query: str, retrieved_chunks: list):
    """Generates an answer based on retrieved context."""
    context_parts = []
    sources = []
    
    for chunk in retrieved_chunks:
        doc_title = chunk.document.title
        page = chunk.page_number
        text = chunk.content
        context_parts.append(f"--- Document: {doc_title}, Page: {page} ---\n{text}")
        
        source_id = f"{doc_title} - Page {page}"
        if source_id not in sources:
            sources.append(source_id)
            
    context_str = "\n\n".join(context_parts)
    
    prompt = PromptTemplate(
        template=PROMPT_TEMPLATE,
        input_variables=["context", "question"]
    )
    
    formatted_prompt = prompt.format(context=context_str, question=query)
    
    response = llm.invoke(formatted_prompt)
    
    return response, sources
