from channels.generic.websocket import AsyncWebsocketConsumer
from redis.exceptions import RedisError
import json, logging

logger = logging.getLogger(__name__)


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.grupo_nombre = "notificaciones"

        try:
            # Redis registra que este cliente entra al grupo
            await self.channel_layer.group_add(
                self.grupo_nombre,
                self.channel_name,
            )

            await self.accept()

            logger.info("¡React conectado y registrado en Redis!")

        except RedisError as e:
            logger.error(f"[{type(e).__name__}]: {e}")
            # Si falla se cierra directamente
            await self.close()


    async def disconnect(self, close_code):
        try:
            # Redis remueve al cliente del grupo
            await self.channel_layer.group_discard(
                self.grupo_nombre,
                self.channel_name,
            )

            logger.info("React desconectado de Redis.")

        except RedisError as e:
            logger.error(f"[{type(e).__name__}]: {e}")

    # Este método recibe el evento enviado desde tu API a través de Redis
    async def send_notification(self, event):
        mensaje = event["message"]

        # Se lo escupe directamente a React
        await self.send(
            text_data=json.dumps(
                {
                    "type": "notification.created",
                    "message": mensaje,
                }
            )
        )
