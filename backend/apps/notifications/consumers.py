from channels.generic.websocket import AsyncWebsocketConsumer
from redis.exceptions import RedisError
import json, logging

logger = logging.getLogger(__name__)


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        user = self.scope["user"]

        if user is None or user.is_anonymous:
            await self.close(
                code=4001,
                reason="Authentication required",
            )

        group_name = f"user_notifications_{user.pk}"

        try:
            self.group_name = group_name

            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name,
            )

            await self.accept()

        except RedisError as e:
            logger.error(f"[{type(e).__name__}]: {e}")
            await self.close()

    async def disconnect(self, close_code):
        try:
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name,
            )
        except RedisError as e:
            logger.error(f"[{type(e).__name__}]: {e}")

    async def send_notification(self, event):
        mensaje = event["message"]

        await self.send(
            text_data=json.dumps(
                {
                    "type": "notification.created",
                    "message": mensaje,
                }
            )
        )
