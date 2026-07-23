from django.db.models import Q
from django_filters import rest_framework as filters
from apps.abstracts.models import Abstract


class AbstractSearchFilter(filters.FilterSet):
    title = filters.CharFilter(field_name="title", lookup_expr="icontains")
    author_name = filters.CharFilter(method="filter_by_author_name")

    class Meta:
        model = Abstract
        fields = ["title", "author_name"]

    def filter_by_author_name(self, queryset, name, value):
        if not value:
            return queryset

        return queryset.filter(
            Q(user__first_name__icontains=value) | 
            Q(user__last_name__icontains=value),
        )
