from apps.abstracts.serializers import AbstractSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from . import models

User = get_user_model()


class ParticipantSerializer(serializers.ModelSerializer):
    abstracts = serializers.SerializerMethodField()

    class Meta:
        model = models.Participant
        fields = (
            "affiliation",
            "job_title",
            "field_of_study",
            "abstracts",
        )

    def get_abstracts(self, obj: models.Participant):
        serializer = AbstractSerializer(obj.user.abstracts, many=True)
        return serializer.data


class TourSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Tour
        fields = "__all__"
