from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import update_last_login
from django.conf import settings
from .serializers import UserSerializer, AbstractSerializer
from .models import Abstract


User = get_user_model()


class UserView(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            email = request.data.get("email", None)
            user = User.objects.get(email=email)
            update_last_login(None, user)

            access_token = response.data.get("access")
            refresh_token = response.data.get("refresh")

            response.set_cookie(
                "refresh_token",
                refresh_token,
                httponly=True,
                secure=settings.COOKIE_SECURE,
                samesite="Lax",
                max_age=86400,
            )

            response.set_cookie(
                "access_token",
                access_token,
                httponly=True,
                secure=settings.COOKIE_SECURE,
                samesite="Lax",
                max_age=900,
            )

        return response


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh_token")

        if refresh_token:
            data = {"refresh": refresh_token}
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

        access_token = token_data.get("access")

        if response.status_code == 200:
            # access_token = response.data.get('access')

            # Actualiza la cookie de acceso
            response.set_cookie(
                "access_token",
                access_token,
                httponly=True,
                secure=COOKIE_SECURE,
                samesite="Lax",
            )

        if "refresh" in token_data:
            response.set_cookie(
                "refresh_token",
                token_data["refresh"],
                httponly=True,
                secure=COOKIE_SECURE,
                samesite="Lax",
            )

        return response


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            # Blacklist de simplejwt,
            token = RefreshToken(request.COOKIES.get("refresh_token"))
            token.blacklist()
            pass
        except Exception as e:
            pass

        response = Response({"message": "Logout exitoso"}, status=status.HTTP_200_OK)

        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")

        return response


class AbstractView(ModelViewSet):
    serializer_class = AbstractSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return user.abstracts.all()
