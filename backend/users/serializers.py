from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers
from utils.validators import valid_email, valid_name
from datetime import datetime
from . import models

User = get_user_model()


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
    participant = ParticipantSerializer(required=False, write_only=True)
    photo = serializers.SerializerMethodField()

    class Meta:
        model = models.User
        fields = ["id", "email", "first_name", "middle_name", "last_name", "prefix", "pronouns", "nationality", "city", "photo", "full_name", "roles", "last_login", "date_joined", "participant"]
        extra_kwargs = {
            "first_name": {
                "validators": [valid_name],
                "allow_blank": False,
            },
            "last_name": {
                "validators": [valid_name],
                "allow_blank": False,
            },
            "email": {
                "validators": [valid_email],
                "allow_blank": False,
            },
            "city": {
                "allow_blank": False,
            },
            "password": {"write_only": True},
            "photo": {"required": False},
        }

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

    def validate_email(self, email):
        user_id = self.instance.id if self.instance else None

        if User.objects.filter(email__iexact=email).exclude(id=user_id).exists():
            raise serializers.ValidationError("This email is already registered.")

        return email

    @transaction.atomic
    def create(self, validated_data):
        participant_data = validated_data.pop("participant", None)

        user = super().create(validated_data)

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


""""""


class AuthorAffiliationSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = models.AuthorAffiliation
        fields = "__all__"


class AuthorSerializer(serializers.ModelSerializer):
    affiliation = AuthorAffiliationSerializer(allow_null=True, required=False)
    abstract_id = serializers.PrimaryKeyRelatedField(queryset=models.Abstract.objects.all(), source="abstract", write_only=True)

    class Meta:
        model = models.Author
        exclude = ["abstract"]
        extra_kwargs = {
            "order": {
                "required": False,
                "read_only": True,
            },
        }

    @transaction.atomic
    def create(self, validated_data):
        abstract = validated_data.get("abstract")
        validated_data["order"] = abstract.authors.count()

        affiliation_data = validated_data.pop("affiliation")
        if affiliation_data is not None:
            affiliation, created = models.AuthorAffiliation.objects.get_or_create(
                institute=affiliation_data.get("institute", None),
                department=affiliation_data.get("department", None),
                nationality=affiliation_data.get("nationality", None),
                city=affiliation_data.get("city", None),
                abstract = abstract,
            )
            validated_data["affiliation"] = affiliation

        instance = super().create(validated_data)
        normalize_author_order(instance.abstract)
        # transaction.set_rollback(True)
        return instance

    @transaction.atomic
    def update(self, instance, validated_data):
        affiliation_data = validated_data.pop("affiliation")
        if affiliation_data is not None:
            affiliation, created = models.AuthorAffiliation.objects.update_or_create(
                institute=affiliation_data.get("institute", None),
                department=affiliation_data.get("department", None),
                nationality=affiliation_data.get("nationality", None),
                city=affiliation_data.get("city", None),
                abstract=instance.abstract,
            )
            validated_data["affiliation"] = affiliation

        instance = super().update(instance, validated_data)
        normalize_author_order(instance.abstract)
        # transaction.set_rollback(True)
        return instance


def normalize_author_order(abstract):
    if abstract is None:
        return

    authors = abstract.authors.order_by("order")
    for index, author in enumerate(authors, start=1):
        if author.order != index:
            author.order = index
            author.save(update_fields=["order"])


class AbstractSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Abstract
        fields = "__all__"
        read_only_fields = ["created_at", "last_update", "needs_review"]

    @transaction.atomic
    def create(self, validated_data):
        instance = models.Abstract()
        request = self.context.get("request", None)
        instance.user = request.user
        instance.save()

        # transaction.on_commit(lambda: signals.on_abstract_created(instance))
        return instance

    @transaction.atomic
    def update(self, instance: models.Abstract, validated_data):
        extra_kwargs = {"previous_status": instance.status}
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.extra_kwargs = extra_kwargs
        instance.save()
        # transaction.on_commit(lambda: signals.on_abstract_updated(instance))
        return instance


class AbstractDeclarationsSerializer(serializers.ModelSerializer):
    abstract_id = serializers.PrimaryKeyRelatedField(queryset=models.Abstract.objects.all(), source="abstract", write_only=True)

    class Meta:
        model = models.AbstractDeclarations
        exclude = ["abstract"]
