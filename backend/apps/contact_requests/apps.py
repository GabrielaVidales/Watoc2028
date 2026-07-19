from django.apps import AppConfig


class ContactRequestsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.contact_requests'
    label = 'contact_requests'

    def ready(self):
        import apps.contact_requests.signals
