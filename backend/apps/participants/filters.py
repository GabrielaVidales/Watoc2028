import django_filters
from apps.abstracts.models import Abstract

class ParticipantSubmissionsFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(field_name='title', lookup_expr="icontains")

    class Meta:
        model = Abstract
        fields = ["title"]
        
        
