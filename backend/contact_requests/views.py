from rest_framework import generics, permissions
from .models import ContactRequest
from .serializers import ContactRequestSerializer

class ContactRequestListCreateView(generics.ListCreateAPIView):
    queryset = ContactRequest.objects.all().order_by('-contact_date')
    serializer_class = ContactRequestSerializer

    def get_permissions(self):
        """
        Lógica personalizada de permisos:
        - POST (Crear mensaje): Cualquiera puede hacerlo (AllowAny).
        - GET (Ver lista): Solo administradores (IsAdminUser).
        """
        if self.request.method == 'POST':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
