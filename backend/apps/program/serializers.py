from rest_framework import serializers
from apps.abstracts.models import Abstract
from apps.abstracts.serializers import AbstractSerializer
from .models import ScheduledEvent


class ContentObjectRelatedField(serializers.RelatedField):
    """
    Campo customizado para mapear la relación
    genérica `content_resource` de ScheduledEvent.
    """

    def to_representation(self, value):
        """Serializa el objeto según su tipo."""

        if isinstance(value, Abstract):
            return AbstractSerializer(value).data

        raise Exception("Unexpected type of tagged object")


class ScheduledEventSerializer(serializers.ModelSerializer):
    content_resource = ContentObjectRelatedField(read_only=True)

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
            "resource_id",
            "resource_type",
            "content_resource",
        ]
