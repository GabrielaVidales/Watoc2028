from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from .models import Participant
from .serializers import ParticipantSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ParticipantSerializer
    permission_classes = [permissions.IsAuthenticated] 

    def get_object(self):
        usuario_actual = self.request.user 
        obj = get_object_or_404(Participant, user=usuario_actual)
        return obj