from django.urls import path
from .views import ContactRequestListCreateView

urlpatterns = [
    # GET: Ver mensajes (Solo Admin)
    # POST: Enviar mensaje de contacto (Público)
    path('contact/', ContactRequestListCreateView.as_view(), name='contact_request'),
]