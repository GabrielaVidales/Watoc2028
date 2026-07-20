from rest_framework import permissions
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import ListAPIView
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.reviews.models import ReviewAssignment, Review
from apps.reviews.serializers import ReviewAssignmentSerializer, ReviewSerializer
from apps.users.serializers import UserSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class ReviewAssignmentViewSet(ModelViewSet):
    queryset = ReviewAssignment.objects.all()
    serializer_class = ReviewAssignmentSerializer
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=["get"], url_path="from-user")
    def get_by_user(self, request, pk=None):
        user = request.user
        queryset = user.review_assignments.all()
        serializer=self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"], url_path="reviews")
    def get_reviews_for_asignment(self, request, pk=None):
        assignment = self.get_object()
        serializer = ReviewSerializer(assignment.reviews.all(), many=True)
        return Response(serializer.data)


class ReviewViewSet(ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]


class ReviewerViewSet(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    
    def list(self, request):
        queryset = self.queryset.filter(review_assignments__isnull=False).distinct()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)  

