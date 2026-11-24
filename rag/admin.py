from django.contrib import admin
from .models import Document, Chunk
from .ingest import ingest_pdf

class ChunkInline(admin.TabularInline):
    model = Chunk
    extra = 0
    readonly_fields = ['page_number', 'content']
    exclude = ['embedding'] # Don't try to render the 384-dim array in admin UI
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'uploaded_at')
    inlines = [ChunkInline]

    def save_model(self, request, obj, form, change):
        is_new = obj.pk is None
        # Save the model and the file to disk first
        super().save_model(request, obj, form, change)
        
        # If it's a new document with a file, extract and chunk it
        if is_new and obj.file:
            try:
                # obj.file.path gives the absolute path to the saved file
                ingest_pdf(obj.file.path, obj)
            except Exception as e:
                print(f"Error ingesting PDF {obj.title}: {e}")

@admin.register(Chunk)
class ChunkAdmin(admin.ModelAdmin):
    list_display = ('document', 'page_number')
    search_fields = ('content',)
    exclude = ['embedding']
