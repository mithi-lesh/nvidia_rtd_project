import fitz  # PyMuPDF
from .models import Document, Chunk
from .chunking import chunk_text
from .embeddings import get_embedding

def ingest_pdf(file_path: str, document_instance: Document):
    """
    Extracts text from a PDF, chunks it, embeds it, and stores it.
    Expects an already saved Document instance.
    """
    with fitz.open(file_path) as pdf_doc:
        for page_num in range(len(pdf_doc)):
            page = pdf_doc[page_num]
            text = page.get_text("text")
            
            if not text.strip():
                continue
                
            chunks = chunk_text(text)
            
            chunk_objects = []
            for chunk_content in chunks:
                embedding = get_embedding(chunk_content)
                chunk_objects.append(
                    Chunk(
                        document=document_instance,
                        page_number=page_num + 1,
                        content=chunk_content,
                        embedding=embedding
                    )
                )
            
            if chunk_objects:
                Chunk.objects.bulk_create(chunk_objects)
