from django.contrib.auth import password_validation
from django.core import exceptions
from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers
from datetime import datetime
from . import models, text_choices, validators
import bleach

User = get_user_model()


class ParticipantSerializer(serializers.ModelSerializer):
    abstracts = serializers.SerializerMethodField()

    class Meta:
        db_table = "participants"
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
            valid_email=validators.validate_email(email, user_id)
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


""""""


class AuthorAffiliationSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = models.AuthorAffiliation
        fields = "__all__"

    def validate(self, attrs=None):
        instance: models.AuthorAffiliation = self.instance
        if not instance:
            return attrs

        if not instance.institute:
            raise serializers.ValidationError("Institute required")
        if not instance.department:
            raise serializers.ValidationError("Department required")
        if not instance.nationality in text_choices.Nationality.values:
            raise serializers.ValidationError("Invalid nationality")
        if not instance.city:
            raise serializers.ValidationError("City required")
        return attrs


class AuthorSerializer(serializers.ModelSerializer):
    affiliation = AuthorAffiliationSerializer(allow_null=True, required=False)
    abstract_id = serializers.PrimaryKeyRelatedField(
        queryset=models.Abstract.objects.all(), source="abstract", write_only=True
    )

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
        validated_data["order"] = abstract.authors.count() + 1

        email_duplicated = models.Author.objects.filter(
            abstract=abstract,
            email=validated_data.get("email"),
        ).exists()

        if email_duplicated:
            raise serializers.ValidationError(
                {
                    "root": ["The submission could not be completed. Please review the errors below."],
                    "email": [
                        "Another author in this abstract already uses this email.",
                    ],
                }
            )

        affiliation_data = validated_data.pop("affiliation")
        if affiliation_data is not None:
            affiliation, _ = models.AuthorAffiliation.objects.get_or_create(
                institute=affiliation_data.get("institute", None),
                department=affiliation_data.get("department", None),
                nationality=affiliation_data.get("nationality", None),
                city=affiliation_data.get("city", None),
                abstract=abstract,
            )
            validated_data["affiliation"] = affiliation

        instance = super().create(validated_data)
        normalize_author_order(instance.abstract)
        # transaction.set_rollback(True)
        return instance

    @transaction.atomic
    def update(self, instance, validated_data):
        instance = self.instance
        email = validated_data.get("email", instance.email)
        email_duplicated = (
            models.Author.objects.exclude(pk=instance.pk)
            .filter(
                abstract=instance.abstract,
                email=email,
            )
            .exists()
        )
        if email_duplicated:
            raise serializers.ValidationError(
                {
                    "root": ["The submission could not be completed. Please review the errors below."],
                    "email": [
                        "Another author in this abstract already uses this email.",
                    ],
                }
            )

        affiliation_data = validated_data.pop("affiliation")
        if affiliation_data is not None:
            affiliation, _ = models.AuthorAffiliation.objects.update_or_create(
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
    authors = serializers.SerializerMethodField()

    class Meta:
        model = models.Abstract
        fields = "__all__"
        read_only_fields = ["created_at", "last_update", "needs_review"]
        
    def get_authors(self, instance):
        return AuthorSerializer(instance.authors.all(), many=True).data
        
    def validate_title(self, value):
        sanitized_value = bleach.clean(value, [], {})
        return sanitized_value

    def validate_text(self, value):
        sanitized_value = bleach.clean(value, [], {})
        return sanitized_value
    
    def validate_references(self, value):
        sanitized_value = bleach.clean(value, [], {})
        return sanitized_value

    @transaction.atomic
    def create(self, validated_data):
        instance = models.Abstract(**validated_data)
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
    abstract_id = serializers.PrimaryKeyRelatedField(
        queryset=models.Abstract.objects.all(), source="abstract", write_only=True
    )

    class Meta:
        model = models.AbstractDeclarations
        exclude = ["abstract"]


"""RUN VALIDATIONS"""


class AbstractSubmitSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Abstract
        fields = "__all__"
        read_only_fields = ["created_at", "last_update", "needs_review"]

    def validate(self, attrs=None):
        instance: models.Abstract = self.instance
        if not instance.title.strip():
            raise serializers.ValidationError("Title required")
        if not instance.text.strip():
            raise serializers.ValidationError("Text required")
        if instance.authors.count() == 0:
            raise serializers.ValidationError("At least one author required")

        orders = sorted(instance.authors.values_list("order", flat=True))
        supposed = list(range(1, len(orders) + 1))
        if orders != supposed:
            raise serializers.ValidationError("Author's order must be continuous")

        for author in instance.authors.all():
            if isinstance(author, models.Author):
                if not author.first_name:
                    raise serializers.ValidationError("First required")
                if not author.last_name:
                    raise serializers.ValidationError("Last required")
                if not author.email:
                    raise serializers.ValidationError("Email required")

                serializer = AuthorAffiliationSerializer(author.affiliation)
                serializer.validate()

        if not instance.references.strip():
            raise serializers.ValidationError("References required")
        if instance.status == models.AbstactStatus.SUBMITTED:
            raise serializers.ValidationError("Abstract already submitted")
        return attrs


class AuthorSubmitSerializer(serializers.ListSerializer):
    class Meta:
        model = models.Author
        exclude = ["abstract"]
        extra_kwargs = {
            "order": {
                "required": False,
                "read_only": True,
            },
        }

    def validate(self, attrs=None):
        instance: models.Author = self.instance
        if not instance.abstract.authors.filter(pk=instance.pk).exist():
            raise serializers.ValidationError("Unrelated abstract data")
        return attrs


"""TOURS DATA"""


class TourSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Tour
        fields = "__all__"
