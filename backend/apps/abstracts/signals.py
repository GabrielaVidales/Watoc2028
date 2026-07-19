import logging
from functools import partial
from django.db import transaction
from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.abstracts.models import Abstract
from apps.notifications.models import Notification

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Abstract)
def notify_abstract_created(sender, instance: Abstract, created: bool, **kwargs):
    if created:
        logger.info(f"Abstract creado: {instance}")

        recipient = instance.user
        actor = None
        message = f"New submission created: {instance.title}."
        target_url = '/'

        transaction.on_commit(
            partial(
                Notification.objects.create,
                recipient=recipient,
                actor=actor,
                message=message,
                target_url=target_url,
            )
        )
    else:
        logger.info(f"Abstract actualizado: {instance}")
