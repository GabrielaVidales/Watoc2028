from channels.generic.websocket import AsyncJsonWebsocketConsumer
import json

class PDFGenerationConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        self.job_id = self.scope["url_route"]["kwargs"]["job_id"]
        self.group_name = f"pdf_job_{self.job_id}"

        print("WS CONNECT:", self.job_id)
        print("WS GROUP:", self.group_name)
        print("WS CHANNEL:", self.channel_name)

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name,
        )

        print("WS GROUP ADD OK")

        await self.accept()

        await self.send(text_data="Hello")

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name,
        )

    async def pdf_status(self, event):
        print('Respondiendo status de job:')
        await self.send_json(
            {
                "type": f"pdf.status.{self.job_id}",
                "message": event.get("message"),
            }
        )
