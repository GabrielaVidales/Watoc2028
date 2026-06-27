from django.contrib.auth import get_user_model
from rest_framework import serializers
from . import models, text_choices

User = get_user_model()


class AffiliationSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = models.Affiliation
        fields = "__all__"

    def validate(self, attrs=None):
        instance: models.Affiliation = self.instance
        if not instance:
            return attrs

        if not instance.institution:
            raise serializers.ValidationError("Institution name required")
        if not instance.country in text_choices.Nationality.values:
            raise serializers.ValidationError("Invalid country")
        if not instance.city:
            raise serializers.ValidationError("City required")
        return attrs
    
    
