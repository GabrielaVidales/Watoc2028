import logging
from django.db import transaction
from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.abstracts.models import Abstract
from apps.notifications.models import Notification

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Notification)
def notify_abstract_created(sender, instance: Notification, created, **kwargs):
    if created:
        transaction.on_commit(
            lambda: logger.info(f"Notificación creada: {instance}"),
        )
