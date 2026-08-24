from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q
from .serializers import NotificationSerializer
from .models import Notification
from config.permissions import HasCSRFToken
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from config.pagination import Pagination
from django_filters.rest_framework import DjangoFilterBackend
from apps.notifications.filters import NotificationFilter

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


class NotificationViewSet(ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = NotificationFilter

    @action(detail=False, methods=["post"], url_path="send-pulse")
    def send_pulse(self, request: Request):
        notification = Notification.objects.first()
        serializer = self.get_serializer(notification)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "notificaciones",
            {
                "type": "send_notification",
                "message": serializer.data,
            },
        )
        return Response("Pulso enviado...")

    @action(detail=False, methods=["get"], url_path="user")
    def get_for_user(self, request: Request):
        user = request.user
        notifications = self.get_queryset().filter(user=user)
        unread_count = notifications.filter(is_read=False).count()
        notifications = self.filter_queryset(notifications)
        paginated_queryset = self.paginate_queryset(notifications)
        serializer = self.get_serializer(paginated_queryset, many=True, context={"request": request})
        paginated_response = self.get_paginated_response(serializer.data)
        return Response(
            {
                "notifications": paginated_response.data,
                "unread_count": unread_count,
            }
        )

    @action(detail=True, methods=["patch"], url_path="toggle-is-read")
    def toggle_is_read(self, request: Request, pk: int = None):
        user = request.user
        notification = self.get_queryset().filter(Q(user=user) & Q(pk=pk)).first()

        if not notification:
            return Response(
                {"code": "not_found", "detail": ("Resource not found.")},
                status=status.HTTP_404_NOT_FOUND,
            )

        is_read = request.data.get("is_read", None)
        if is_read is None:
            return Response(
                {"errors": {"is_read": ["Please make sure you've entered a valid argument and try again."]}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        notification.is_read = is_read
        notification.save(update_fields=["is_read"])
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=["patch"], url_path="toggle-all-read")
    def toggle_all_read(self, request: Request, pk: int = None):
        user = request.user
        notification = self.get_queryset().filter(Q(user=user))
        notification.update(is_read=True)
        return Response(status=status.HTTP_204_NO_CONTENT)
