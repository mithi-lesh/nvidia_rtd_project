from django.urls import path
from . import views

urlpatterns = [
    path('api/documents/', views.document_list, name='document_list'),
    path('api/documents/<int:doc_id>/', views.document_detail, name='document_detail'),
]
