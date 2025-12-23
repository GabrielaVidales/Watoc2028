from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError
from .models import Visa
from .serializers import VisaSerializer

class VisaCreateView(generics.CreateAPIView):
    """ El usuario crea su solicitud de visa (marca que la necesita) """
    serializer_class = VisaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        if Visa.objects.filter(user=self.request.user).exists():
            raise ValidationError("Ya tienes una solicitud de visa creada.")
        serializer.save(user=self.request.user)

class VisaDetailView(generics.RetrieveUpdateAPIView):
    """ El usuario ve si ya tiene su carta o cambia si requiere visa """
    serializer_class = VisaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        try:
            return self.request.user.visa_info
        except Visa.DoesNotExist:
            raise ValidationError("No has creado una solicitud de visa.")