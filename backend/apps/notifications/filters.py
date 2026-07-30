import django_filters
from apps.notifications.models import Notification

class NotificationFilter(django_filters.FilterSet):
    is_read = django_filters.BooleanFilter(field_name='is_read')

    class Meta:
        model = Notification
        fields = ["is_read"]
        
        
