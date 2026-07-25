import logging
from django.db import transaction
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from apps.notifications.models import Notification

logger = logging.getLogger(__name__)

# Los signas de Notifications sirven solo para logs
# La creación de notificaciones ocurre en los signals 
# otras apps de Django

@receiver(post_save, sender=Notification)
def on_abstract_created(sender, instance: Notification, created, **kwargs):
    if created:
        transaction.on_commit(
            lambda: logger.info(f"Notificación creada: {instance}"),
        )

@receiver(post_delete, sender=Notification)
def on_abstract_deleted(sender, instance: Notification, **kwargs):
    transaction.on_commit(
            lambda: logger.info(f"Notificación eliminada: {instance}"),
    )

