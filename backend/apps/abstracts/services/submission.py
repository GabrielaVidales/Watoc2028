from django.core.exceptions import ValidationError
from apps.abstracts.models import Abstract, Author
from apps.abstracts.serializers import AbstractSerializer, AuthorSerializer
from types import SimpleNamespace
import json

def validate_abstract_for_submission(abstract: Abstract):
    serializer = AbstractSerializer(
        instance=abstract,
        data=AbstractSerializer(abstract).data,
        context={
            "view": SimpleNamespace(action="submit"),
        },
    )
    
    if not serializer.is_valid():
        raise ValidationError(serializer.errors)

