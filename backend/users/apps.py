from django.apps import AppConfig
from django.db.models.signals import post_migrate


ROLES = [
    'participant',
    'admin',
    'reviewer',
]

class UsersConfig(AppConfig):
    name = "users"

    def ready(self):
        post_migrate.connect(self.create_user_groups, sender=self)

    @staticmethod
    def create_user_groups(**kwargs: any):
        """Crear grupos de usuario si no existen cuando Django inicie"""        
        from django.contrib.auth.models import Group
        
        for role in ROLES:
            Group.objects.get_or_create(name=role)
        
