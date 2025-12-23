from django.urls import path
from .views import ParticipantProfileCreateView, ParticipantProfileDetailView

urlpatterns = [
    # Rutas Participantes
    path('participant/create/', ParticipantProfileCreateView.as_view(), name='participant-create'),
    path('participant/me/', ParticipantProfileDetailView.as_view(), name='participant-me'),
]