from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers
from utils.validators import valid_email, valid_name
from datetime import datetime
from . import models

User = get_user_model()


class ParticipantSerializer(serializers.ModelSerializer):
    # abstracts = serializers.SerializerMethodField()

    class Meta:
        model = models.Participant
        fields = (
            "affiliation",
            "job_title",
            "field_of_study",
        )

    # def get_abstracts(self, obj: models.Participant):
    #     from users.serializers import AbstractSerializer

    #     return AbstractSerializer(obj.user.abstracts.exclude(status="deleted"), many=True).data


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

    def validate_participant(self, value):
        print('queee')
        return value

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
        print('puta madreee')
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
        print('PUTA')
        
        
        user = super().update(instance, validated_data)

        p_instance = user.participant
        participant_serializer = ParticipantSerializer(p_instance, data=participant_data, partial=True)
        if participant_serializer.is_valid(raise_exception=True):
            p_instance = participant_serializer.save(user=user)

        return user


class AuthorSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = models.Author
        exclude = ["abstract"]
        extra_kwargs = {"order": {"required": False}, "name": {"required": False}}


class AbstractSerializer(serializers.ModelSerializer):
    authors = AuthorSerializer(many=True)

    class Meta:
        model = models.Abstract
        fields = "__all__"
        read_only_fields = ["created_at", "last_update", "needs_review"]

    @transaction.atomic
    def create(self, validated_data):
        authors = validated_data.pop("authors")
        instance = models.Abstract(**validated_data)
        request = self.context.get("request", None)
        instance.user = request.user
        instance.save()

        for index, author in enumerate(authors):
            models.Author.objects.create(name=author.get("name"), order=index, is_corresponding=author.get("is_corresponding", False), abstract=instance)

        # transaction.on_commit(lambda: signals.on_abstract_created(instance))
        return instance

    @transaction.atomic
    def update(self, instance: models.Abstract, validated_data):
        authors_data = validated_data.pop("authors")
        keywords_data = validated_data.pop("keywords")

        instance.authors.all().delete()
        instance.keywords.all().delete()

        extra_kwargs = {"previous_status": instance.status}
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # se hace esto porque si los _data traen id's produce un
        # django.db.utils.IntegrityError: UNIQUE constraint failed: users_author.id
        for a in authors_data:
            a.pop("id", None)
        for k in keywords_data:
            k.pop("id", None)

        models.Author.objects.bulk_create([models.Author(abstract=instance, **a) for a in authors_data])

        instance.extra_kwargs = extra_kwargs
        instance.save()

        # transaction.on_commit(lambda: signals.on_abstract_updated(instance))
        return instance
