from rest_framework import permissions
from rest_framework.viewsets import ModelViewSet
from django.contrib.auth import get_user_model
from config.pagination import Pagination
from .models import ScheduledEvent, Tag
from .serializers import ScheduledEventSerializer, TagSerializer
import logging

User = get_user_model()

logger = logging.getLogger(__name__)


class ScheduledEventViewSet(ModelViewSet):
    queryset = ScheduledEvent.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = ScheduledEventSerializer
    pagination_class = Pagination


class TagViewSet(ModelViewSet):
    queryset = Tag.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = TagSerializer
    pagination_class = Pagination
