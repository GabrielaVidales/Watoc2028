from rest_framework import serializers
from apps.users.models import User
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
            "is_staff",
            "is_active",
            "middle_name",
            "user_permissions",
            "nationality",
            "city",
        ]


class NotificationSerializer(serializers.ModelSerializer):
    user = UserDetailNotification(read_only=True)
    actor = UserDetailNotification(read_only=True)

    user_id = serializers.PrimaryKeyRelatedField(source="user", queryset=User.objects.all(), write_only=True)

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
            "user",
            "actor",
            "user_id",
            "actor_id",
            "message",
            "urlpath",
            "is_read",
            "created_at",
        ]
        
    def get_created_at(self, obj):
        return int(obj.created_at.timestamp() * 1000)
