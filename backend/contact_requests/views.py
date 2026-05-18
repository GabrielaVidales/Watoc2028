from django.db import transaction
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from config.permissions import HasCSRFToken
from .models import ContactRequest
from .serializers import ContactRequestSerializer
from .tasks import send_contact_request_email

class ContactRequestListCreateView(generics.ListCreateAPIView):
    queryset = ContactRequest.objects.all().order_by("-created_at")
    serializer_class = ContactRequestSerializer

    def get_permissions(self):
        """
        Lógica personalizada de permisos:
        - POST (Crear mensaje): Requiere un token CSRF.
        - GET (Ver lista): Solo administradores (IsAdminUser).
        """
        if self.request.method == "POST":
            return [HasCSRFToken()]
        return [permissions.IsAdminUser()]

    @transaction.atomic
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            instance: ContactRequest = serializer.save()
            
            # función lambda
            transaction.on_commit(lambda: send_contact_request_email.delay(instance.pk))
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        return Response(status=status.HTTP_400_BAD_REQUEST)


