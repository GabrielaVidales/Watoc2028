from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['university', 'proof_document']
        # El user se asigna automáticamente en la vista
