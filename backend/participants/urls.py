from django.urls import path
from .views import  UserProfileView

urlpatterns = [
    # Rutas Participantes
    path('participant/profile/', UserProfileView.as_view(), name='participant-profile'),
]