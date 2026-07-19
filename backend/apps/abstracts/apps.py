from django.apps import AppConfig


class AbstractsConfig(AppConfig):
    name = 'apps.abstracts'

    def ready(self):
        import apps.abstracts.signals