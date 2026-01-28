from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError
from .models import Student
from .serializers import StudentSerializer

# --- VISTAS PARA ESTUDIANTES ---

class StudentProfileCreateView(generics.CreateAPIView):
    """ Crea el perfil de estudiante para el usuario logueado """
    serializer_class = StudentSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        # Verifica si ya tiene un perfil para evitar error 500
        if Student.objects.filter(user=self.request.user).exists():
            raise ValidationError("Ya tienes un perfil de estudiante creado.")
        serializer.save(user=self.request.user)

class StudentProfileDetailView(generics.RetrieveUpdateDestroyAPIView):
    """ Ver, Editar o Borrar mi perfil de estudiante """
    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Busca el perfil del usuario actual
        try:
            return self.request.user.student_profile
        except Student.DoesNotExist:
            # Si intenta ver su perfil y no existe, lanza 404
            raise ValidationError("No tienes un perfil de estudiante. Créalo primero.")