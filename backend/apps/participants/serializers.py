from apps.abstracts.serializers import AbstractSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from . import models

User = get_user_model()


class ParticipantSerializer(serializers.ModelSerializer):
    abstracts = serializers.SerializerMethodField()

    class Meta:
        model = models.Participant
        fields = "__all__"

    def get_abstracts(self, obj: models.Participant):
        serializer = AbstractSerializer(obj.user.abstracts.all(), many=True)
        return serializer.data

    def validate(self, attrs):
        print(attrs)
        return super().validate(attrs)

    def update(self, instance, validated_data):
        print(instance)
        print(validated_data)

        return super().update(instance, validated_data)


class TourSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Tour
        fields = "__all__"
