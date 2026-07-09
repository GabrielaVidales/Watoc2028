from django.contrib.auth import password_validation
from django.core import exceptions
from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers
from datetime import datetime
from . import models, validators
import bleach

User = get_user_model()


from abstracts.serializers import AbstractSerializer

class ParticipantSerializer(serializers.ModelSerializer):
    abstracts = serializers.SerializerMethodField()

    class Meta:
        model = models.Participant
        fields = (
            "affiliation",
            "job_title",
            "field_of_study",
            "abstracts",
        )

    def get_abstracts(self, obj: models.Participant):
        serializer = AbstractSerializer(obj.user.abstracts, many=True)
        return serializer.data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        db_table = "users"
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
            "nationality",
            "city",
            "photo",
            "full_name",
            "roles",
            "last_login",
            "date_joined",
            "participant",
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
            "email": {
                "allow_blank": False,
            },
            "city": {
                "allow_blank": False,
            },
            "password": {"write_only": True},
            "photo": {"required": False},
        }

    participant = ParticipantSerializer(required=False)
    photo = serializers.SerializerMethodField()

    def get_photo(self, obj):
        if not obj.photo:
            return None
        try:
            photo_url = obj.photo.url
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            request = self.context.get("request")

            if request is not None:
                photo_url = request.build_absolute_uri(photo_url)

            return f"{photo_url}?t={timestamp}"
        except Exception:
            return None

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
        participant_data = validated_data.pop("participant", None)
        email = validated_data.pop("email", None)
        password = validated_data.pop("password", None)

        user = User.objects.create_user(email=email, password=password, **validated_data)

        participant_serializer = ParticipantSerializer(data=participant_data)
        if participant_serializer.is_valid(raise_exception=True):
            p_instance = participant_serializer.save(user=user)
            models.Dinner.objects.create(participant=p_instance)

        return user

    @transaction.atomic
    def update(self, instance, validated_data):
        participant_data = validated_data.pop("participant", None)

        user = super().update(instance, validated_data)

        p_instance = user.participant
        participant_serializer = ParticipantSerializer(p_instance, data=participant_data, partial=True)
        if participant_serializer.is_valid(raise_exception=True):
            p_instance = participant_serializer.save(user=user)

        return user


"""TOURS DATA"""


class TourSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Tour
        fields = "__all__"
