from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from apps.participants.models import Tour
from apps.participants.serializers import TourSerializer
from rest_framework import permissions


class TourView(ModelViewSet):
    queryset = Tour.objects.all()
    serializer_class = TourSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ["get"]
