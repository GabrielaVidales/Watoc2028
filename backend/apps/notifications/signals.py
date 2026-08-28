import logging
from django.db import transaction
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from apps.notifications.models import Notification
from apps.notifications.serializers import NotificationSerializer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from functools import partial

logger = logging.getLogger(__name__)

# Los signals de Notifications sirven solo para logs
# y enviar a través de websocket.
# La creación de notificaciones ocurre en los signals
# de otras apps de Django. Específicamente en los
# signals de post_save de los modelos.


def _send_message_to_channel(instance, user_id):
    logger.info(f"Notificación creada: {instance}")

    channel_layer = get_channel_layer()
    group_name = f"user_notifications_{user_id}"
    serializer = NotificationSerializer(instance)

    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            "type": "send_notification",
            "message": serializer.data,
        },
    )


@receiver(post_save, sender=Notification)
def on_abstract_created(sender, instance: Notification, created, **kwargs):
    if created:
        transaction.on_commit(
            partial(
                _send_message_to_channel,
                instance,
                instance.user.pk,
            )
        )


@receiver(post_delete, sender=Notification)
def on_abstract_deleted(sender, instance: Notification, **kwargs):
    transaction.on_commit(
        lambda: logger.info(f"Notificación eliminada: {instance}"),
    )
