from django.apps import AppConfig
from django.db.models.signals import post_migrate


ROLES = [
    'participant',
    'admin',
    'reviewer',
]

class UsersConfig(AppConfig):
    name = "apps.users"
    label = "users"

    def ready(self):
        post_migrate.connect(self.create_user_groups, sender=self)

    @staticmethod
    def create_user_groups(**kwargs: any):
        """Crear grupos de usuario si no existen cuando Django inicie"""        
        from django.contrib.auth.models import Group
        from apps.users.models import User
        
        # user = User.objects.create_superuser(email='eduardo1582000@gmail.com', password='password')
        for role in ROLES:
            role, created = Group.objects.get_or_create(name=role)
            # user.groups.add(role)
        # user.save()
        
        # print('Superuser created')
            
        
