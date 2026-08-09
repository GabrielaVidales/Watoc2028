from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from apps.abstracts.models import PDFGenerationJob
from apps.abstracts.serializers import PDFGenerationJobSerializer


class PDFGenerationConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        self.job_id = self.scope["url_route"]["kwargs"]["job_id"]
        self.group_name = f"pdf_job_{self.job_id}"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name,
        )

        print(f"ACCEPT: {f"pdf_job_{self.job_id}"}")
        await self.accept()

        job = await self.get_job()
        if job is not None:
            serializer = PDFGenerationJobSerializer(job)
            print(f"INITIAL STATUS: {serializer.data}")
            
            await self.send_json({
                "type": f"pdf.status.{self.job_id}",
                "message": serializer.data,
            })

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name,
        )

    async def pdf_status(self, event):
        print("Respondiendo status de job:")
        await self.send_json(
            {
                "type": f"pdf.status.{self.job_id}",
                "message": event.get("message"),
            }
        )

    @database_sync_to_async
    def get_job(self):
        try:
            return PDFGenerationJob.objects.get(id=self.job_id)
        except PDFGenerationJob.DoesNotExist:
            return None
