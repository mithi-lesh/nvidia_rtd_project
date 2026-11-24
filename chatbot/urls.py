from django.urls import path
from . import views

urlpatterns = [
    path('api/chat/', views.chat_api, name='chat_api'),
    path('api/auth/login/', views.login_api, name='login_api'),
    path('api/auth/register/', views.register_api, name='register_api'),
]
