from sentence_transformers import SentenceTransformer

# Load the BGE-small embedding model
# This will be downloaded on first use and cached.
encoder = SentenceTransformer("BAAI/bge-small-en-v1.5")

def get_embedding(text: str) -> list[float]:
    """Generates a 384-dimensional embedding vector for the given text."""
    # BGE documentation recommends normalize_embeddings=True
    return encoder.encode(text, normalize_embeddings=True).tolist()
