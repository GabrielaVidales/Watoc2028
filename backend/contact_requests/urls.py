from django.urls import path
from .views import ContactRequestListCreateView

urlpatterns = [
    path('contact/', ContactRequestListCreateView.as_view(), name='contact_request'),
]