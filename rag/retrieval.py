from pgvector.django import CosineDistance
from .models import Chunk
from .embeddings import get_embedding

def retrieve_context(query: str, top_k: int = 4):
    """Retrieves the most relevant chunks for a given query."""
    query_embedding = get_embedding(query)
    
    # Order chunks by cosine distance (closest first)
    chunks = Chunk.objects.order_by(CosineDistance('embedding', query_embedding))[:top_k]
    return list(chunks)
