from rest_framework import serializers
from .models import Visa

class VisaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Visa
        fields = ['id', 'requires_visa', 'invitation_letter', 'created_at']
        read_only_fields = ['id', 'invitation_letter', 'created_at'] 
        # El usuario solo puede modificar 'requires_visa'