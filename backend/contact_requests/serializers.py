from rest_framework import serializers
from .models import ContactRequest

class ContactRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactRequest
        fields = ['id', 'first_name', 'last_name', 'email', 'type', 'question', 'contact_date']
        read_only_fields = ['id', 'contact_date']