from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from apps.participants.models import Participant

User = settings.AUTH_USER_MODEL

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        print('Profile created!')
        Participant.objects.create(user=instance)