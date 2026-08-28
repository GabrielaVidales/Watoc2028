from django_filters.rest_framework import DjangoFilterBackend
from config.pagination import Pagination
from apps.participants.models import Participant, Tour
from apps.participants.filters import ParticipantSubmissionsFilter
from apps.participants.serializers import ParticipantSerializer, TourSerializer, AbstractSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework import permissions, status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser


class ParticipantView(ModelViewSet):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [DjangoFilterBackend]
    # filterset_class = ParticipantSubmissionsFilter
    parser_classes = [
        JSONParser,
        MultiPartParser,
        FormParser,
    ]

    @action(detail=True, methods=["patch"], url_path="student-proof")
    def update_student_proof(self, request: Request, pk=None):
        file = request.FILES.get("student_proof", None)
        if file is None:
            return Response(
                {"errors": {"student_proof": ["No file was sent to save"]}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        instance: Participant = self.get_object()
        old_file = instance.student_proof
        instance.student_proof = file
        instance.save(update_fields=["student_proof"])
        
        if old_file:
            old_file.delete(save=False)

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=["get"], url_path="submissions")
    def get_participant_submissions(self, request):
        queryset = request.user.abstracts.all()
        queryset = self.filter_queryset(queryset)
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
