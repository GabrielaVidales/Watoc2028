from rest_framework import serializers
from .models import Abstract

class AbstractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Abstract
        fields = ['id', 'co_authors', 'presentation_type', 'abstract_file', 'status', 'submission_date']
        # El usuario no debe poder editar el 'status' ni la fecha, solo el admin.
        read_only_fields = ['id', 'status', 'submission_date']