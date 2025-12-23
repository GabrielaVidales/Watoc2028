from django.urls import path
from .views import VisaCreateView, VisaDetailView

urlpatterns = [
    path('visa/create/', VisaCreateView.as_view(), name='visa-create'),
    path('visa/me/', VisaDetailView.as_view(), name='visa-me'),
]