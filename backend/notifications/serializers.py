from django.utils import timezone
from rest_framework import serializers
from users.serializers import UserSerializer
from users.models import User
from .models import Notification


class UserDetailNotification(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = [
            "password",
            "is_superuser",
            "last_login",
            "email_verified",
            "groups",
            "user_permissions",
        ]


class NotificationSerializer(serializers.ModelSerializer):
    recipient = UserDetailNotification(read_only=True)
    actor = UserDetailNotification(read_only=True)

    recipient_id = serializers.PrimaryKeyRelatedField(source="recipient", queryset=User.objects.all(), write_only=True)

    created_at = serializers.SerializerMethodField()

    actor_id = serializers.PrimaryKeyRelatedField(
        source="actor",
        queryset=User.objects.all(),
        allow_null=True,
        required=False,
        write_only=True,
    )

    class Meta:
        model = Notification
        fields = [
            "id",
            "recipient",
            "actor",
            "recipient_id",
            "actor_id",
            "verb",
            "target_url",
            "is_read",
            "created_at",
        ]
        
    def get_created_at(self, obj):
        return int(obj.created_at.timestamp() * 1000)

