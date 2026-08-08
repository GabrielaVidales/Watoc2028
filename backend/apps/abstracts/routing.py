from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("ws/pdf/<uuid:job_id>/", consumers.PDFGenerationConsumer.as_asgi()),
]
