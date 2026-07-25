from rest_framework.viewsets import ModelViewSet
from apps.participants.models import Participant, Tour
from apps.participants.serializers import ParticipantSerializer, TourSerializer, AbstractSerializer
from rest_framework import permissions
from rest_framework.decorators import action
from config.pagination import Pagination


class ParticipantView(ModelViewSet):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = Pagination

    @action(detail=False, methods=["get"], url_path="submissions")
    def get_participant_submissions(self, request):
        queryset = request.user.abstracts.all()
        page = self.paginate_queryset(queryset)
        serializer = AbstractSerializer(
            page,
            many=True,
            context={"request": request},
        )
        return self.get_paginated_response(serializer.data)


class TourView(ModelViewSet):
    queryset = Tour.objects.all()
    serializer_class = TourSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ["get"]
