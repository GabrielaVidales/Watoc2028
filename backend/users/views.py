from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import CustomUserSerializer, CustomUserUpdateSerializer,ChangePasswordSerializer, RequestResetCodeSerializer, VerifyCodeSerializer, SetNewPasswordSerializer
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import update_last_login
from django.conf import settings
import random
from .models import PasswordResetCode
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail

User = get_user_model()

# Registro de Usuarios (Pública)
class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = (MultiPartParser, FormParser)

# Ver y Editar mi propio perfil (Privada)
class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = CustomUserUpdateSerializer
    permission_classes = [permissions.IsAuthenticated] 
    parser_classes = (MultiPartParser, FormParser) 

    def get_object(self):
            return self.request.user  
    
# vista para cambiar la contraseña del usuario    
class ChangePasswordView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = ChangePasswordSerializer  
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        # 1. Llamamos al método original para que haga la validación y guardado
        # Si algo falla (contraseña incorrecta), el super() lanzará la excepción automáticamente.
        super().update(request, *args, **kwargs)

        # 2. Si llegamos aquí, es que todo salió bien. 
        # Devolvemos nuestra respuesta personalizada.
        return Response(
            {
                "status": "success",
                "message": "Contraseña actualizada correctamente. Por favor inicia sesión nuevamente."
            },
            status=status.HTTP_200_OK
        )

# COOKIE_SECURE = getattr(settings, 'SESSION_COOKIE_SECURE', False) 
COOKIE_SECURE = False   

# Clase para crear los tokens (refresh y access) y guardarlos en el cookie
class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        print("response: ",response)
        print(request.data)

        if response.status_code == 200:
            email = request.data.get('email') 
            user = User.objects.get(email = email)
            update_last_login(None,user)

            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')

            response.set_cookie(
                'refresh_token',
                refresh_token,
                httponly= True,
                secure= COOKIE_SECURE,
                samesite='Lax'
            )  

            response.set_cookie(
                'access_token',
                access_token,
                httponly= True,
                secure= COOKIE_SECURE,
                samesite='Lax'
            )
              
        return response 
     
# Clase para generar nuevos tokens
class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        
        if refresh_token:
            data = {'refresh': refresh_token} 
        else:
            data = request.data     

        serializer = self.get_serializer(data=data)  

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0]) 

        # Obtenemos los nuevos datos (el nuevo access token)
        token_data = serializer.validated_data 
        response = Response(token_data, status=200)
        
        access_token = token_data.get('access')

        if response.status_code == 200:
            # access_token = response.data.get('access')
            
            # Actualiza la cookie de acceso
            response.set_cookie(
                'access_token',
                access_token,
                httponly=True,
                secure=COOKIE_SECURE,
                samesite='Lax'
            )

        if 'refresh' in token_data:
             response.set_cookie(
                'refresh_token',
                token_data['refresh'],
                httponly=True,
                secure=COOKIE_SECURE,
                samesite='Lax'
            )
            
        return response
    
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated] 

    def post(self, request):
        try:
            # Blacklist de simplejwt,
            token = RefreshToken(request.COOKIES.get('refresh_token'))
            token.blacklist()
            pass
        except Exception as e:
            pass

        response = Response({"message": "Logout exitoso"}, status=status.HTTP_200_OK)
        
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        
        return response

#En desarrollo---------------------------
class RequestResetCodeView(APIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RequestResetCodeSerializer

    def post(self, request):
        serializer = self.serializer_class(data = request.data)
        serializer.is_valid(raise_exception = True)
        email = serializer.validated_data['email']
        user = User.objects.get(email=email)

        code = str(random.randint(100000, 999999))

        PasswordResetCode.objects.update_or_create(
            user=user, defaults={'code': code}
        )
        # 3. Enviar correo (Aquí iría tu función send_mail)
        # 3. ENVIAR CORREO DIRECTAMENTE AQUÍ
        subject = 'Wactoc 2028: Tu código de recuperación'
        message = f'Hola, tu código para restablecer contraseña es: {code}'
        email_from = settings.EMAIL_HOST_USER
        recipient_list = [email]

        # Esto puede tardar unos segundos, pero es fácil de programar
        send_mail(subject, message, email_from, recipient_list)

        return Response({"message": "Código enviado a tu correo"}, status=status.HTTP_200_OK)    

class VerifyCodeView(APIView):
    """
    Docstring for VerifyCodeView
    post: se validan que los datos se encuentren en la BD y se encriptan los datos
    para luego ser enviador al endpoint: api/set-new-password/

    """
    
    serializer_class = VerifyCodeSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        user = User.objects.get(email=email)
        
        # EL CÓDIGO ES CORRECTO. AHORA GENERAMOS EL PASE PARA EL NIVEL 3.
        # 1. Generamos token seguro de Django
        token = default_token_generator.make_token(user)
        # 2. Codificamos el ID del usuario
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        
        # Una vez verificado, borramos el código para que no se use de nuevo
        PasswordResetCode.objects.get(user=user).delete()

        return Response({
            "message": "Código verificado correctamente",
            "uidb64": uidb64,   # <--- Llave 1 para el frontend
            "token": token      # <--- Llave 2 para el frontend
        }, status=status.HTTP_200_OK)

class SetNewPasswordView(APIView):
    serializer_class = SetNewPasswordSerializer

    def patch(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Recuperamos el usuario validado desde el serializer
        user = serializer.user
        password = serializer.validated_data['password']

        # Establecemos la nueva contraseña (esto la hashea automáticamente)
        user.set_password(password)
        user.save()

        return Response({"message": "Contraseña actualizada exitosamente"}, status=status.HTTP_200_OK)

# class VerificationPasswordView(APIView):
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = RecoveryPassword

#     def post(self, request):
#         serializer = self.serializer_class(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         print("Código validado:", serializer.validated_data['verification_code'])
        
#         return Response(
#             {"message": "Cambio de contraseña exitoso"},
#             status=status.HTTP_200_OK)
    


      
    



