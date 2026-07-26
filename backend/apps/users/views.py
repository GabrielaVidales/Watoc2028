from rest_framework import permissions, status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, ParticipantSerializer
from config.permissions import HasCSRFToken
from config.pagination import Pagination
from .tasks import send_email_confirmation_email
import logging

User = get_user_model()

logger = logging.getLogger("users")


class UserView(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    filter_backends = [SearchFilter]
    search_fields = ["first_name", "last_name", "email"]
    pagination_class = Pagination
    

    def get_permissions(self):
        if self.action == "create" or self.action == "session":
            return [HasCSRFToken()]
        return [permissions.IsAuthenticated(), HasCSRFToken()]

    def perform_create(self, serializer):
        user = serializer.save(email_verified=False)
        # TODO: añadir un transaction.on_commit
        send_email_confirmation_email.delay(user.id)

    @action(detail=False, methods=["get"], url_path="session")
    @method_decorator(ensure_csrf_cookie)
    def session(self, request):
        user = request.user
        data = {}
        data["anonymous"] = user.is_anonymous
        if user.is_authenticated:
            data["user"] = self.get_serializer(user).data
            return Response(data)
        return Response(data, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=["post"], url_path="resend-verification-email")
    def send_verification_email(self, request):
        user = request.user
        if user.email_verified or not user.is_active:
            return Response({"detail": "Email already verified!"}, status=status.HTTP_400_BAD_REQUEST)

        send_email_confirmation_email.delay(user.id)
        print(f"Confirmation email sended to {user.email}")
        return Response(
            {"message": f"We've sent a new verification link to your email address. Please check your inbox and spam folder. {user.email}"},
        )

    @action(detail=False, methods=["get"], url_path="profile")
    def profiles(self, request):
        profiles = {}
        user_is_participant = request.user.groups.filter(name="participant").exists()
        if user_is_participant and hasattr(request.user, "participant"):
            profiles["participant"] = ParticipantSerializer(request.user.participant).data
        return Response(profiles, status=200)

    @action(detail=False, methods=["post", "delete"], url_path="change-profile-pic")
    def change_profile_pic(self, request):
        user = self.request.user

        if request.method == "POST":
            file = request.data.get("photo", None)
            if file is not None and user.is_authenticated:
                if user.photo:
                    user.photo.delete()
                user.photo = file
                user.save()
                return Response({"detail": "Profile picture was succesfully updated"})

        elif request.method == "DELETE":
            profile_picture = user.photo
            if profile_picture:
                profile_picture.delete(save=True)
            return Response({"detail": "Profile picture was succesfully deleted"})

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

