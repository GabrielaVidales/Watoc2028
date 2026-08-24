from django.urls import path, re_path
from . import consumers

websocket_urlpatterns = [
    re_path(
        r"ws/api/abstracts/jobs/pdf/(?P<job_id>[^/]+)/$",
        consumers.PDFGenerationConsumer.as_asgi(),
    ),
]
