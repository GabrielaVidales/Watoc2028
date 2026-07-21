import django_filters
from datetime import datetime
from django.contrib.auth import get_user_model

User = get_user_model()


class TimestampDateFilter(django_filters.NumberFilter):
    """
    Convierte un Unix Timestamp enviado desde el Frontend a datetime en UTC.
    Solo toma en cuenta día, mes y año, ignorando, horas, minutos, segundos, etc.
    """

    def filter(self, queryset, value):
        if value is None:
            return queryset

        # Si el timestamp viene en milisegundos (Date.now()), lo convertimos a segundos
        timestamp_seconds = value / 1000 if value > 1e11 else value

        # Creamos el objeto datetime consciente de zona horaria en UTC
        dt = datetime.fromtimestamp(timestamp_seconds, tz=datetime.timezone.utc)

        # El lookup solo toma en cuenta la parte date de datetime
        lookup = {f"{self.field_name}__date": dt.date()}
        return super().filter(**lookup)


class TimestampFilter(django_filters.NumberFilter):
    """
    Convierte un Unix Timestamp enviado desde el Frontend a datetime en UTC.
    Soporta timestamps tanto en milisegundos (13 dígitos) como en segundos (10 dígitos).
    """

    def filter(self, queryset, value):
        if value is None:
            return queryset

        # Si el timestamp viene en milisegundos (Date.now()), lo convertimos a segundos
        timestamp_seconds = value / 1000 if value > 1e11 else value

        # Creamos el objeto datetime consciente de zona horaria en UTC
        dt_value = datetime.fromtimestamp(timestamp_seconds, tz=datetime.timezone.utc)

        # Aplicamos el lookup configurado (gt, lt, exact, etc.)
        lookup = f"{self.field_name}__{self.lookup_expr}"
        return queryset.filter(**{lookup: dt_value})


class NumberInFilter(django_filters.BaseInFilter, django_filters.NumberFilter):
    pass


class CharInFilter(django_filters.BaseInFilter, django_filters.CharFilter):
    pass


class BooleanInFilter(django_filters.BaseInFilter, django_filters.BooleanFilter):
    pass


class UserFilter(django_filters.FilterSet):
    # id: idealmente siempre por containt in array [...] basta
    id__in = NumberInFilter(field_name="id", lookup_expr="in")

    # Campos de texto con contains basta
    email = django_filters.CharFilter(field_name="email", lookup_expr="icontains")
    first_name = django_filters.CharFilter(field_name="first_name", lookup_expr="icontains")
    last_name = django_filters.CharFilter(field_name="last_name", lookup_expr="icontains")

    # Roles por inclusión o exclusión en array [...]
    roles__in = CharInFilter(field_name="groups__name", lookup_expr="in")
    roles__not_in = CharInFilter(field_name="groups__name", lookup_expr="in", exclude=True)

    # Igual a roles
    status__in = BooleanInFilter(field_name="is_active", lookup_expr="in")  # O tu campo de estado
    status__not_in = BooleanInFilter(field_name="is_active", lookup_expr="in", exclude=True)  # O tu campo de estado

    # Solo toma en cuenta date
    creation_date = TimestampDateFilter(field_name="date_joined", lookup_expr="exact")
    creation_date__ne = TimestampDateFilter(field_name="date_joined", lookup_expr="exact", exclude=True)

    # Datetime completo
    creation_date__lt = TimestampFilter(field_name="date_joined", lookup_expr="lt")
    creation_date__gt = TimestampFilter(field_name="date_joined", lookup_expr="gt")

    class Meta:
        model = User
        fields = []
