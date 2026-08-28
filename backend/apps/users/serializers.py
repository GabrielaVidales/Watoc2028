from apps.participants.serializers import ParticipantSerializer
from apps.participants.models import Participant
from django.contrib.auth import password_validation
from django.core import exceptions
from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers
from datetime import datetime
from . import models, validators
import bleach, os

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    photo = serializers.SerializerMethodField()
    photo_filename = serializers.SerializerMethodField()

    class Meta:
        model = models.User
        fields = [
            "id",
            "email",
            "email_verified",
            "is_active",
            "password",
            "first_name",
            "middle_name",
            "last_name",
            "prefix",
            "pronouns",
            "job_title",
            "field_of_study",
            "institution",
            "nationality",
            "city",
            "photo",
            "photo_filename",
            "full_name",
            "roles",
            "last_login",
            "date_joined",
        ]
        extra_kwargs = {
            "first_name": {
                "validators": [validators.valid_name],
                "allow_blank": False,
            },
            "last_name": {
                "validators": [validators.valid_name],
                "allow_blank": False,
            },
            "password": {"write_only": True},
            "photo": {"required": False},
        }

    def get_photo(self, user):
        if not user.photo:
            return None
        try:
            photo_url = user.photo.url
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            request = self.context.get("request")

            if request is not None:
                photo_url = request.build_absolute_uri(photo_url)

            return f"{photo_url}?t={timestamp}"
        except Exception:
            return None

    def get_photo_filename(self, user):
        if user.photo and user.photo.name:
            return os.path.basename(user.photo.name)
        return ""

    def validate_first_name(self, value):
        return bleach.clean(value, [], [])

    def validate_last_name(self, value):
        return bleach.clean(value, [], [])

    def validate_email(self, email):
        try:
            user_id = self.instance.id if self.instance else None
            valid_email = validators.validate_email(email, user_id)
        except exceptions.ValidationError as e:
            raise exceptions.ValidationError(list(e.messages))
        return valid_email

    def validate_password(self, value):
        try:
            password_validation.validate_password(value)
        except exceptions.ValidationError as e:
            raise exceptions.ValidationError(list(e.messages))
        return value

    @transaction.atomic
    def create(self, validated_data):
        email = validated_data.pop("email", None)
        password = validated_data.pop("password", None)

        # Esto dispara un signal para crear el profile de manera síncrona
        user = User.objects.create_user(
            email=email,
            password=password,
            **validated_data,
        )

        # transaction.set_rollback(True)
        return user

    @transaction.atomic
    def update(self, instance, validated_data):

        user = super().update(instance, validated_data)


        return user
