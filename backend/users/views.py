# from django.shortcuts import render
# # users/views.py
# from rest_framework import generics, permissions
# from .serializers import UserSerializer
# from rest_framework.permissions import AllowAny
# from .serializers import RegisterSerializer
# from django.contrib.auth import get_user_model

# User = get_user_model()

# class RegisterView(generics.CreateAPIView):
#     queryset = User.objects.all()
#     permission_classes = (AllowAny,) # Permitir registro sin token
#     serializer_class = RegisterSerializer

# class ManageUserView(generics.RetrieveAPIView):
#     serializer_class = UserSerializer
#     permission_classes = [permissions.IsAuthenticated] # Solo usuarios logueados

#     def get_object(self):
#         # Devuelve el usuario que está haciendo la petición (basado en el token)
#         return self.request.user

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import CustomUserSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

# VISTA 1: Registro de Usuarios (Pública)
class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.AllowAny] # Cualquiera puede registrarse
    
    # IMPORTANTE: Estos parsers permiten recibir imágenes y archivos
    parser_classes = (MultiPartParser, FormParser)

# VISTA 2: Ver y Editar mi propio perfil (Privada)
class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated] # Solo si está logueado
    parser_classes = (MultiPartParser, FormParser) # Para poder actualizar la foto

    def get_object(self):
        # Retorna el usuario que está haciendo la petición (self.request.user)
        # Así evitamos tener que pasar el ID en la URL (/users/1/)
        return self.request.user  