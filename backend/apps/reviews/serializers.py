from rest_framework import serializers
from apps.reviews.models import ReviewAssignment, Review
from apps.abstracts.models import Abstract
from django.contrib.auth import get_user_model
from django.db import transaction
from datetime import datetime

User = get_user_model()


class RelatedUserSerializer(serializers.ModelSerializer):
    photo = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "prefix",
            "photo",
            "full_name",
        ]

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


class AbstractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Abstract
        fields = [
            "id",
            "title",
            "presentation_type",
            "created_at",
            "last_update",
            "last_review_at",
        ]


class ReviewAssignmentSerializer(serializers.ModelSerializer):
    created_at = serializers.SerializerMethodField()
    last_update = serializers.SerializerMethodField()
    user = RelatedUserSerializer()
    assigned_by = RelatedUserSerializer()
    abstract = AbstractSerializer()

    class Meta:
        model = ReviewAssignment
        fields = "__all__"

    def get_created_at(self, obj):
        return int(obj.created_at.timestamp() * 1000)

    def get_last_update(self, obj):
        return int(obj.last_update.timestamp() * 1000)


class ReviewSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Review
        fields = "__all__"
