from rest_framework import generics, permissions
from .models import Abstract
from .serializers import AbstractSerializer

class AbstractListCreateView(generics.ListCreateAPIView):
    """
    GET: Lista los abstracts del usuario logueado.
    POST: Crea un nuevo abstract asignado al usuario logueado.
    """
    serializer_class = AbstractSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Si es staff ve todos, si no, solo los suyos
        if user.is_staff:
            return Abstract.objects.all()
        return Abstract.objects.filter(user=user)

    def perform_create(self, serializer):
        # Asigna el usuario automáticamente al guardar
        serializer.save(user=self.request.user)

class AbstractDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET, PUT, PATCH, DELETE un abstract específico.
    Solo permite acceso si el abstract pertenece al usuario.
    """
    serializer_class = AbstractSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Abstract.objects.all()
        return Abstract.objects.filter(user=user)