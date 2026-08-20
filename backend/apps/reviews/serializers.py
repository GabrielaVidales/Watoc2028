from rest_framework import serializers
from apps.reviews.models import ReviewAssignment, Review
from apps.abstracts.models import Abstract
from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import Q
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
    user = serializers.SerializerMethodField()

    class Meta:
        model = Abstract
        fields = [
            "id",
            "title",
            "presentation_type",
            "created_at",
            "last_update",
            "last_review_at",
            "user",
        ]

    def get_user(self, instance):
        return RelatedUserSerializer(instance.user, context=self.context).data


class ReviewAssignmentSerializer(serializers.ModelSerializer):
    # estos son read_only=True para que POST reciba los ID
    user = RelatedUserSerializer(read_only=True)
    abstract = AbstractSerializer(read_only=True)
    assigned_by = RelatedUserSerializer(read_only=True)

    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source="user",
        write_only=True,
    )
    abstract_id = serializers.PrimaryKeyRelatedField(
        queryset=Abstract.objects.all(),
        source="abstract",
        write_only=True,
    )
    assigned_by_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source="assigned_by",
        write_only=True,
    )
    due_date = serializers.DateTimeField(write_only=True)

    last_update_timestamp = serializers.SerializerMethodField()
    created_at_timestamp = serializers.SerializerMethodField()
    due_date_timestamp = serializers.SerializerMethodField()

    class Meta:
        model = ReviewAssignment
        fields = [
            "id",
            "user",
            "user_id",
            "abstract",
            "abstract_id",
            "assigned_by",
            "assigned_by_id",
            "is_active",
            "due_date",
            "due_date_timestamp",
            "created_at_timestamp",
            "last_update_timestamp",
        ]
        validators = []

    def get_due_date_timestamp(self, obj):
        return int(obj.due_date.timestamp() * 1000)

    def get_created_at_timestamp(self, obj):
        return int(obj.created_at.timestamp() * 1000)

    def get_last_update_timestamp(self, obj):
        return int(obj.last_update.timestamp() * 1000)

    def validate(self, attrs):
        errors = {}

        is_already_assigned = False

        abstract = attrs["abstract"]
        user = attrs["user"]

        query = Q(abstract=abstract) & Q(is_active=True)

        # Si es un update se excluye el objeto
        if self.instance:
            query &= ~Q(id=self.instance.pk)

        queryset = ReviewAssignment.objects.filter(query)
        is_already_assigned = queryset.count() > 0
        active_assignment = queryset.first()

        if is_already_assigned:
            errors["abstract"] = [f"This abstract is already assigned to other user: {active_assignment.user.get_full_name()}."]

        if self.instance is not None:
            if active_assignment is not None:
                is_of_user = self.instance.pk != active_assignment.pk
                if is_of_user:
                    errors["user"] = [f"This abstract is already assigned to this user."]
                    errors["abstract"] = []

        else:
            if active_assignment is not None:

                is_of_user = user.pk == active_assignment.pk

                if is_of_user:
                    errors["user"] = [f"This abstract is already assigned to other user: {user.get_full_name()}."]
                    errors["abstract"] = []

        if errors:
            print(errors)
            raise serializers.ValidationError(errors)
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        print("REPUTA: ", validated_data)
        response = super().create(validated_data)

        transaction.set_rollback(True)
        return response


class ReviewSerializer(serializers.ModelSerializer):
    submitted_by = RelatedUserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = "__all__"
