from django.apps import AppConfig


class ContactRequestsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'contact_requests'

    def ready(self):
        import contact_requests.signals
