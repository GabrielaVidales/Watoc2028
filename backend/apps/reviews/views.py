from django.db import transaction
from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import permissions
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import ListAPIView
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.reviews.models import ReviewAssignment, Review
from apps.reviews.serializers import ReviewAssignmentSerializer, ReviewSerializer
from apps.users.serializers import UserSerializer
from apps.reviews.filters import UserFilter
from config.pagination import Pagination

User = get_user_model()


class ReviewAssignmentViewSet(ModelViewSet):
    queryset = ReviewAssignment.objects.all()
    serializer_class = ReviewAssignmentSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = Pagination
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        transaction.set_rollback(True)
        return response

    @action(detail=False, methods=["get"], url_path="for-user")
    def get_by_user(self, request, pk=None):
        """Este endpoint devuelve las asignaciones de un usuario"""
        user = request.user
        queryset = user.review_assignments.all()
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(paginated_queryset, many=True, context={"request": request})
        paginated_response = self.get_paginated_response(serializer.data)
        return paginated_response

    @action(detail=True, methods=["get"], url_path="reviews")
    def get_reviews_for_asignment(self, request, pk=None):
        """Este endpoint devuelve las Reviews que un revisor ha hecho de sus ponencias asignadas"""
        assignment = self.get_object()
        serializer = ReviewSerializer(assignment.reviews.all(), many=True)
        return Response(serializer.data)


class ReviewViewSet(ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]


class ReviewerViewSet(ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_class = UserFilter

    def get_queryset(self):
        return User.objects.filter(review_assignments__isnull=False).distinct()
