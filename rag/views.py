from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Document, Chunk
from .ingest import ingest_pdf
import json

@csrf_exempt
def document_list(request):
    if request.method == 'GET':
        documents = Document.objects.all().order_by('-uploaded_at')
        data = []
        for doc in documents:
            try:
                size_mb = round(doc.file.size / 1024 / 1024, 2)
                size_str = f"{size_mb} MB"
            except:
                size_str = "Unknown"

            data.append({
                'id': str(doc.id),
                'title': doc.title,
                'category': doc.category,
                'type': 'PDF',
                'size': size_str,
                'uploadDate': doc.uploaded_at.strftime('%Y-%m-%d'),
                'status': 'Indexed'
            })
        return JsonResponse(data, safe=False)
        
    elif request.method == 'POST':
        try:
            file = request.FILES.get('file')
            title = request.POST.get('title', file.name if file else 'Untitled')
            category = request.POST.get('category', 'General')
            
            if not file:
                return JsonResponse({'error': 'No file provided'}, status=400)
                
            doc = Document.objects.create(
                title=title,
                category=category,
                file=file
            )
            
            ingest_pdf(doc.file.path, doc)
            
            try:
                size_mb = round(doc.file.size / 1024 / 1024, 2)
                size_str = f"{size_mb} MB"
            except:
                size_str = "Unknown"

            return JsonResponse({
                'id': str(doc.id),
                'title': doc.title,
                'category': doc.category,
                'type': 'PDF',
                'size': size_str,
                'uploadDate': doc.uploaded_at.strftime('%Y-%m-%d'),
                'status': 'Indexed'
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
            
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def document_detail(request, doc_id):
    if request.method == 'DELETE':
        try:
            doc = Document.objects.get(id=doc_id)
            doc.delete()
            return JsonResponse({'success': True})
        except Document.DoesNotExist:
            return JsonResponse({'error': 'Document not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
            
    return JsonResponse({'error': 'Method not allowed'}, status=405)
