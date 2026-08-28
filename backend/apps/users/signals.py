from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from apps.participants.models import Participant, Dinner
from logging import getLogger

User = settings.AUTH_USER_MODEL

logger = getLogger(__name__)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        participant_data, is_new = Participant.objects.get_or_create(user=instance)
        if is_new:
            logger.info('New participant data created!')
            
        _, is_new = Dinner.objects.get_or_create(participant=participant_data)
        if is_new:
            logger.info('New dinner details created!')