from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from rag.retrieval import retrieve_context
from rag.llm import generate_answer
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User

@csrf_exempt
def chat_api(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            question = data.get('question', '')
            
            print("Received chat request:", question, flush=True)
            
            if not question:
                return JsonResponse({'error': 'No question provided'}, status=400)
                
            print("Retrieving context...", flush=True)
            chunks = retrieve_context(question)
            print("Context retrieved. Generating answer...", flush=True)
            answer, sources = generate_answer(question, chunks)
            print("Answer generated successfully.", flush=True)
            
            return JsonResponse({
                'answer': answer,
                'sources': sources
            })
            
        except Exception as e:
            print(f"Error in chat_api: {e}", flush=True)
            return JsonResponse({'error': str(e)}, status=500)
            
    return JsonResponse({'error': 'Only POST method is allowed'}, status=405)

@csrf_exempt
def login_api(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({'success': True, 'username': user.username})
            else:
                return JsonResponse({'error': 'Invalid username or password'}, status=401)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Only POST method is allowed'}, status=405)

@csrf_exempt
def register_api(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            
            if not username or not password:
                return JsonResponse({'error': 'Username and password are required'}, status=400)
                
            if User.objects.filter(username=username).exists():
                return JsonResponse({'error': 'Username already exists'}, status=400)
                
            user = User.objects.create_user(username=username, password=password)
            login(request, user)
            return JsonResponse({'success': True, 'username': user.username})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Only POST method is allowed'}, status=405)
