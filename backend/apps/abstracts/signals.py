import logging, bleach
from functools import partial
from django.db import transaction
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from apps.abstracts.models import Abstract
from apps.notifications.models import Notification

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Abstract)
def notify_abstract_created(sender, instance: Abstract, created: bool, raw: bool, **kwargs):
    if raw:
        return

    if created:
        logger.info(f"Abstract creado [{instance.pk}]: {instance}")

        user = instance.user
        actor = None
        sanitized_title = bleach.clean(instance.title, [], {}, strip=True)
        message = f"New submission created: {sanitized_title}."
        urlpath = "/"

        transaction.on_commit(
            partial(
                Notification.objects.create,
                user=user,
                actor=actor,
                message=message,
                urlpath=urlpath,
            )
        )
    else:
        logger.info(f"Abstract actualizado [{instance.pk}]: {instance}")


@receiver(post_delete, sender=Abstract)
def notify_abstract_deleted(sender, instance: Abstract, **kwargs):
    logger.info(f"Abstract eliminado [{instance.pk}]: {instance}")

    sanitized_title = bleach.clean(instance.title, [], {}, strip=True)
    message = f"Submission {sanitized_title} deleted."
    urlpath = "/user/notifications"

    transaction.on_commit(
        partial(
            Notification.objects.create,
            user=instance.user,
            actor=None,
            message=message,
            urlpath=urlpath,
        )
    )
