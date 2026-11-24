from django.db import models
from pgvector.django import VectorField

class Document(models.Model):
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100, blank=True)
    file = models.FileField(upload_to='documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Chunk(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='chunks')
    page_number = models.IntegerField()
    content = models.TextField()
    embedding = VectorField(dimensions=384)

    def __str__(self):
        return f"{self.document.title} - Page {self.page_number}"
