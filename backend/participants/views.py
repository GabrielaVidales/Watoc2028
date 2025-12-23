from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError
from .models import Participant
from .serializers import  ParticipantSerializer

class ParticipantProfileCreateView(generics.CreateAPIView):
    serializer_class = ParticipantSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        if Participant.objects.filter(user=self.request.user).exists():
            raise ValidationError("Ya tienes un perfil de participante.")
        serializer.save(user=self.request.user)

class ParticipantProfileDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ParticipantSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        try:
            return self.request.user.participant_profile
        except Participant.DoesNotExist:
            raise ValidationError("No tienes un perfil de participante.")
