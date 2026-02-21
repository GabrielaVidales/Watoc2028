from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers
from utils.mixins import EmptyStringToNoneMixin
from . import models

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = "__all__"
        extra_kwargs = {"order": {"required": False}, "name": {"required": False}}


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
