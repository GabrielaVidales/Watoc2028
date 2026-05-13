from rest_framework import serializers
from .models import ContactRequest

class ContactRequestSerializer(serializers.ModelSerializer):
    subject = serializers.SerializerMethodField()
    
    class Meta:
        model = ContactRequest
        fields = '__all__'
        read_only_fields = ['id', 'created_at']
        
    def get_subject(self, obj:ContactRequest):
        return obj.get_subject_display().lower()