from rest_framework import permissions, status
from rest_framework.viewsets import ModelViewSet
from rest_framework.request import Request
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.conf import settings
from django.http import HttpResponse
from config.pagination import Pagination
from .models import ScheduledEvent
from .serializers import ScheduledEventSerializer
import os, logging

User = get_user_model()

logger = logging.getLogger(__name__)


class ScheduledEventViewSet(ModelViewSet):
    queryset = ScheduledEvent.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = ScheduledEventSerializer
    pagination_class = Pagination

