from rest_framework import permissions, status
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.models import update_last_login
from django.contrib.auth import get_user_model, password_validation
from django.conf import settings
from django.core import exceptions
from config.permissions import HasCSRFToken
from .tasks import send_reset_password_email
from itsdangerous import BadSignature
from itsdangerous import SignatureExpired
from itsdangerous import URLSafeTimedSerializer
from utils.lib import get_password_signature
import logging

serializer = URLSafeTimedSerializer(settings.SECRET_KEY)

User = get_user_model()

logger = logging.getLogger("users")


class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [HasCSRFToken]

    def post(self, request):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            response = Response(serializer.validated_data, status=status.HTTP_200_OK)
        except Exception as e:
            email = request.data.get("email")
            email_registered = User.objects.filter(email=email).exists()
            if not email_registered:
                return Response(
                    {
                        "errors": {
                            "email": ["This email is not registered for WATOC 2028."],
                            "root": ["Authentication failed!"],
                        }
                    },
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            else:
                user = User.objects.filter(email=email).first()
                # Contraseña equivocada
                if user and not user.check_password(request.data["password"]):
                    return Response(
                        {
                            "errors": {
                                "password": ["Incorrect password. Please verify your credentials."],
                                "root": ["Authentication failed!"],
                            }
                        },
                        status=status.HTTP_401_UNAUTHORIZED,
                    )
                # otro error
                else:
                    return Response(
                        {
                            "errors": {
                                "root": ["Something went wrong!"],
                            }
                        },
                        status=status.HTTP_401_UNAUTHORIZED,
                    )

        user = serializer.user
        update_last_login(None, user)

        access_token = response.data.get("access")
        refresh_token = response.data.get("refresh")
        response.set_cookie(
            "access_token",
            access_token,
            httponly=True,
            secure=settings.COOKIE_SECURE,
            samesite="Lax",
            max_age=900,
            path="/",
        )
        response.set_cookie(
            "refresh_token",
            refresh_token,
            httponly=True,
            secure=settings.COOKIE_SECURE,
            samesite="Lax",
            max_age=604800,
            path="/",
        )
        return response


class CustomTokenRefreshView(TokenRefreshView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        if not request.has_refresh_token:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        serializer = self.get_serializer(data={"refresh": request.refresh_token})
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            print(e)
            response = Response(status=status.HTTP_401_UNAUTHORIZED)
            response.delete_cookie("access_token", path="/")
            response.delete_cookie("refresh_token", path="/")
            return response
        except AuthenticationFailed as e:
            print(e)
            response = Response(status=status.HTTP_401_UNAUTHORIZED)
            response.delete_cookie("access_token", path="/")
            response.delete_cookie("refresh_token", path="/")
            return response

        response = Response(status=status.HTTP_200_OK)
        
        # Si el cliente es mobile, no se insertan cookies
        if request.is_mobile:
            return response
        
        # Para clientes web, poner cookies
        if "access" in serializer.validated_data:
            response.set_cookie(
                "access_token",
                serializer.validated_data["access"],
                httponly=True,
                secure=settings.COOKIE_SECURE,
                samesite="Lax",
                max_age=900,
                path="/",
            )
        if "refresh" in serializer.validated_data:
            response.set_cookie(
                "refresh_token",
                serializer.validated_data["refresh"],
                httponly=True,
                secure=settings.COOKIE_SECURE,
                samesite="Lax",
                max_age=604800,
                path="/",
            )
        return response


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            token = RefreshToken(request.COOKIES.get("refresh_token"))
            token.blacklist()
        except Exception:
            pass

        response = Response({"message": "Logout exitoso"}, status=status.HTTP_200_OK)
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response


class EmailVerificationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request: Request):
        token = request.data.get("token")
        if not token:
            return Response(
                {"code": "missing_token", "detail": ("Verification token is required.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            data = serializer.loads(token, max_age=60 * 60 * 24, salt="email-verification")
        except SignatureExpired:
            return Response(
                {
                    "code": "token_expired",
                    "detail": ("This verification link has expired. Please request a new verification email."),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        except BadSignature as e:
            logger.error(e.message)
            return Response(
                {"code": "invalid_token", "detail": ("This verification link is invalid.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(id=data["user_id"])
        except User.DoesNotExist:
            return Response(
                {
                    "code": "user_not_found",
                    "detail": "We could not find an account associated with this verification link.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user.email != data["email"]:
            return Response(
                {"code": "invalid_token_data", "detail": ("This verification link is invalid.")},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if user.email_verified:
            return Response(
                {"code": "already_verified", "detail": ("Your email address has already been verified.")},
                status=status.HTTP_200_OK,
            )

        user.email_verified = True
        user.save(update_fields=["email_verified", "is_active"])
        logger.info(f"Email verified -> {user.email}")
        return Response(
            {"code": "verification_success", "detail": ("Your email has been verified successfully.")},
            status=status.HTTP_200_OK,
        )


class PasswordResetView(ViewSet):
    """
    1. Usuario solicita reset
    └→ Genera token con firma HMAC de password actual
    └→ Envía email con token

    2. Usuario hace clic en link
    └→ Frontend verifica token (opcional)
    └→ Muestra formulario si es válido

    3. Usuario envía nueva password
    └→ Backend verifica token
    └→ Compara firma HMAC del token con password actual
    └→ Si son iguales → la password NO ha cambiado → permitir
    └→ Si son diferentes → token ya fue usado → rechazar
    └→ Cambia password
    └→ El token nunca más podrá usarse (la firma ya no coincide)
    """

    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=["post"])
    def request(self, request):
        email = request.data.get("email", "")

        if not email:
            logger.warning("[PasswordResetView] — Solicitud de restablecimiento sin proporcionar email")
            return Response(
                {"errors": {"email": ["Please make sure you've entered a valid email address and try again."]}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        logger.info(f"[PasswordResetView] — Solicitud de restablecimiento de contraseña - Email: {email}")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            logger.warning(f"[PasswordResetView] — Intento de restablecimiento para usuario inexistente - Email: {email}")
            
            return Response(
                {"errors": {"email": ["No account is associated with this email address."]}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not user.is_active:
            logger.warning(f"[PasswordResetView] — Intento de restablecimiento para cuenta inactiva - ID: {user.id}, Email: {email}")
            
            return Response(
                {"errors": {"email": ["This account is currently inactive. Please contact support for assistance."]}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # signature = get_password_signature(user)
        # send_reset_password_email.delay(user.email, signature)
        
        logger.info(f"[PasswordResetView] — Email de restablecimiento encolado - ID: {user.id}, Email: {email}")

        return Response(
            {"detail": "If an account exists with this email address, you will receive a password reset link. Don't forget to check your spam folder"},
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=["post"])
    def verify(self, request):
        token = request.data.get("token")

        logger.info(f"[PasswordResetView] — Intento de verificación: {token[:14]}...")

        try:  # verificar si el token es válido y tiene menos de 1 día
            data = serializer.loads(token, max_age=60 * 60 * 24, salt="password-reset")
            logger.info(f"[PasswordResetView] — Token verificado - User ID: {data['user_id']}")
        except SignatureExpired:
            logger.warning(f"[PasswordResetView] — Token expirado - Token: {token[:20]}...")
            return Response({"detail": "Your token has expired!"}, status=status.HTTP_400_BAD_REQUEST)
        except BadSignature:
            logger.error(f"[PasswordResetView] — Firma de token inválida - Token: {token[:20]}...")
            return Response({"detail": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=data["user_id"])
        except User.DoesNotExist:
            logger.error(f"[PasswordResetView] — Usuario no encontrado para el token - ID de usuario: {data['user_id']}")
            return Response({"detail": "User does not exist."}, status=status.HTTP_400_BAD_REQUEST)

        if not user.email_verified or not user.is_active:
            logger.warning(f"[PasswordResetView] — Usuario inactivo o no verificado intentó resetear - ID: {user.id}, Email: {user.email}")
            return Response({"detail": "This action is invalid!"}, status=status.HTTP_400_BAD_REQUEST)

        logger.info(f"[PasswordResetView] — Verificación de token completada exitosamente - ID de usuario: {user.id}, Email: {user.email}")
        return Response({"detail": "verified"})

    @action(detail=False, methods=["post"])
    def confirm(self, request):
        token = request.data.get("token")
        password = request.data.get("password")
        confirm_password = request.data.get("confirm_password")

        # Confirmar que estén presentes los argumentos
        if not password or not confirm_password:
            return Response({"detail": "Password and confirm password are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Validar que las contraseñas son idénticas
        if password != confirm_password:
            return Response(
                {"errors": {"root": ["Passwords do not match."]}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            data = serializer.loads(token, max_age=60 * 60 * 24, salt="password-reset")
        except SignatureExpired:
            return Response(
                {"errors": {"root": ["Token has expired."]}},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except BadSignature:
            return Response(
                {"errors": {"root": ["Invalid token."]}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(id=data["user_id"])
        except User.DoesNotExist:
            return Response(
                {"errors": {"root": ["User account does not exist."]}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not user.email_verified or not user.is_active:
            return Response(
                {"errors": {"root": ["Something went wrong."]}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user.check_password(password):
            return Response(
                {"errors": {"root": ["New password cannot be the same as your current password."]}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validar password, esto toma en cuenta lo que hay en validators.py y en SETTINGS
        try:
            password_validation.validate_password(password)
        except exceptions.ValidationError as e:
            raise exceptions.ValidationError(list(e.messages))

        # Comparar firmas de la contraseña actual
        # con la firma del token cuando fue creado
        # así se sabe si ya se usó o es falsificado
        signature = get_password_signature(user)
        token_signature = data["password_signature"]
        if signature != token_signature:
            return Response(
                {"errors": {"root": ["This reset link is no longer valid."]}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        logger.info(f"[PasswordResetView] — Reseteo de contraseña exitoso - ID: {user.id}, Email: {user.email}")
        user.set_password(password)
        user.save(update_fields=["password"])

        return Response(
            {"detail": "Your password has been reset successfully. You can now log in with your new password."},
            status=status.HTTP_200_OK,
        )
