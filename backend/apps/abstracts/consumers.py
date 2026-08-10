from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async


class PDFGenerationConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        self.job_id = self.scope["url_route"]["kwargs"]["job_id"]
        self.group_name = f"pdf_job_{self.job_id}"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name,
        )

        await self.accept()

        # Esto es importante: se puede dar una race condition
        # en la que la tarea se complete ANTES de siquiera establecer
        # la conexión, por lo que se debe mandar un status inicial
        job = await self.get_job()
        if job is not None:
            from apps.abstracts.serializers import PDFGenerationJobSerializer
            
            serializer = PDFGenerationJobSerializer(job)
            
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
        from apps.abstracts.models import PDFGenerationJob
        try:
            return PDFGenerationJob.objects.get(id=self.job_id)
        except PDFGenerationJob.DoesNotExist:
            return None
