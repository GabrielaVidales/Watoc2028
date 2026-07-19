import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.grupo_nombre = "notificaciones"

        # Redis registra que este cliente entra al grupo
        await self.channel_layer.group_add(
            self.grupo_nombre,
            self.channel_name
        )
        await self.accept()
        print("¡React conectado y registrado en Redis!")

    async def disconnect(self, close_code):
        # Redis remueve al cliente del grupo
        await self.channel_layer.group_discard(
            self.grupo_nombre,
            self.channel_name
        )
        print("React desconectado de Redis.")

    # Este método recibe el evento enviado desde tu API a través de Redis
    async def enviar_notificacion(self, event):
        mensaje = event['message']

        # Se lo escupe directamente a React
        await self.send(text_data=json.dumps({
            'type': 'notification.created',
            'message': mensaje
        }))