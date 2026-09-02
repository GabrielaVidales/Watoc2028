from django.db import transaction
from django.contrib.contenttypes.models import ContentType
from rest_framework import serializers
from apps.abstracts.models import Abstract
from apps.abstracts.serializers import AbstractSerializer
from .models import ScheduledEvent, Tag
from apps.users.serializers import UserSerializer, User

CONTENT_SERIALIZERS = {
    Abstract: AbstractSerializer,
    User: UserSerializer,
}

RESOURCE_TYPE_MAP = {
    "abstract": Abstract,
    "user": User,
}


class TagSerializer(serializers.ModelSerializer):
    description = serializers.CharField(validators=[])

    class Meta:
        model = Tag
        fields = "__all__"

    def create(self, validated_data):
        print("QUEEEEEEEE?E?E?E??????")
        return super().create(validated_data)


class ChoiceToContentType(serializers.ChoiceField):
    def to_representation(self, value):
        model_class = value.model_class()
        key = RESOURCE_TYPE_MAP.get(model_class, None)
        if key is None:
            return f"{value.app_label}.{value.model}"
        return key

    def to_internal_value(self, data):
        key = super().to_internal_value(data)
        model_class = RESOURCE_TYPE_MAP.get(key, None)
        if model_class is None:
            return None
        content_type = ContentType.objects.get_for_model(model_class)
        return content_type


class ScheduledEventSerializer(serializers.ModelSerializer):
    resource_type = ChoiceToContentType(
        choices=list(RESOURCE_TYPE_MAP.keys()),
        write_only=True,
    )
    resource_id = serializers.IntegerField(write_only=True)
    resource = serializers.SerializerMethodField()
    tags = TagSerializer(
        many=True,
        required=False,
    )

    class Meta:
        model = ScheduledEvent
        fields = [
            "id",
            "last_update",
            "created_at",
            "is_active",
            "title",
            "description",
            "start_time",
            "end_time",
            "resource",
            "resource_id",
            "resource_type",
            "lounge",
            "tags",
        ]

    def get_resource(self, instance: ScheduledEvent):
        resource = instance.content_resource
        if resource is None:
            return None

        serializer = CONTENT_SERIALIZERS.get(type(resource))
        if serializer is None:
            return {
                "type": instance.resource_type.name,
                "object": instance.content_resource.pk,
            }

        data = serializer(resource).data
        return {
            "type": instance.resource_type.name,
            "object": data,
        }

    @transaction.atomic()
    def create(self, validated_data):
        tags = validated_data.pop("tags", [])

        # for k, v in validated_data.items():
        #     print(f"{k} = {v}")

        # print(f"tags = {tags}")

        event = ScheduledEvent.objects.create(**validated_data)

        print()
        for tag in tags:
            description = tag["description"]
            tag, _ = Tag.objects.get_or_create(description=description)
            
            print(tag)

        # event = ScheduledEvent.objects.first()
        transaction.set_rollback(True)
        return event
