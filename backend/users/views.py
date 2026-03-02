from django.db import transaction
from rest_framework import permissions, status
from rest_framework.decorators import action
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
from .serializers import UserSerializer, AbstractSerializer, ParticipantSerializer, AuthorSerializer, AuthorAffiliationSerializer
from .models import Abstract, Participant, Author, AuthorAffiliation


User = get_user_model()


class UserView(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=["get"], url_path="session")
    def whoami(self, request):
        user = request.user
        data = {}
        data["anonymous"] = user.is_anonymous
        if user.is_authenticated:
            data["user"] = self.get_serializer(user).data

        return Response(data)

    @action(detail=False, methods=["get"], url_path="profile")
    def profiles(self, request):
        profiles = {}
        user_is_participant = request.user.groups.filter(name="participant").exists()
        if user_is_participant and hasattr(request.user, "participant"):
            profiles["participant"] = ParticipantSerializer(request.user.participant).data
        return Response(profiles, status=200)

    @action(detail=False, methods=["post"], url_path="change-profile-pic")
    def change_profile_pic(self, request):
        user = self.request.user
        file = request.data.get("photo", None)
        if file is not None and user.is_authenticated:
            if user.photo:
                user.photo.delete()
            user.photo = file
            user.save()
            return Response(status=status.HTTP_200_OK)

        return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"], url_path="change-password")
    def change_password(self, request):
        user = self.request.user

        old_password = request.data.get("oldPassword")
        if not old_password:
            return Response(
                {"oldPassword": ["This field is required."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        new_password = request.data.get("newPassword", None)
        if not new_password:
            return Response(
                {"newPassword": ["This field is required."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        is_old_pwd_ok = user.check_password(old_password)
        if not is_old_pwd_ok:
            return Response(
                {"oldPassword": ["Current password is incorrect."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()
        return Response(
            {"detail": "Password changed successfully."},
            status=status.HTTP_200_OK,
        )


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
                "access_token",
                access_token,
                httponly=True,
                secure=settings.COOKIE_SECURE,
                samesite="Lax",
                max_age=86400,
            )

            response.set_cookie(
                "refresh_token",
                refresh_token,
                httponly=True,
                secure=settings.COOKIE_SECURE,
                samesite="Lax",
                max_age=2592000,
            )

        return response


class CustomTokenRefreshView(TokenRefreshView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        token = request.COOKIES.get("refresh_token")
        if token:
            data = {"refresh": token}
        else:
            data = request.data

        serializer = self.get_serializer(data=data)
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])
        token_data = serializer.validated_data

        access_token = token_data.get("access")
        refresh_roken = token_data.get("refresh")
        response = Response(token_data, status=200)
        response.set_cookie(
            "access_token",
            access_token,
            httponly=True,
            secure=settings.COOKIE_SECURE,
            samesite="Lax",
            max_age=86400,
        )

        response.set_cookie(
            "refresh_token",
            refresh_roken,
            httponly=True,
            secure=settings.COOKIE_SECURE,
            samesite="Lax",
            max_age=2592000,
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
    queryset = Abstract.objects.all()
    serializer_class = AbstractSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=True, methods=["get"], url_path="affiliations")
    def get_affiliations(self, request, pk=None):
        abstract = self.get_object()
        data = AuthorAffiliationSerializer(abstract.affiliations.all(), many=True)
        return Response(data.data)
    
    
    

class AuthorsView(ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [permissions.IsAuthenticated]


class AuthorAffiliationsView(ModelViewSet):
    queryset = AuthorAffiliation.objects.all()
    serializer_class=AuthorAffiliationSerializer
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        instance = super().create(request, *args, **kwargs)
        transaction.set_rollback(True)
        return instance