from django.urls import path
from .views import AbstractListCreateView, AbstractDetailView

urlpatterns = [
    # Listar mis abstracts y subir uno nuevo (Multipart/form-data)
    path('abstracts/', AbstractListCreateView.as_view(), name='abstract-list-create'),
    
    # Ver detalle, editar o borrar un abstract específico
    path('abstracts/<int:pk>/', AbstractDetailView.as_view(), name='abstract-detail'),
]