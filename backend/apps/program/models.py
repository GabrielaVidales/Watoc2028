from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from config.common.models import LoggableModel


class ScheduledEvent(LoggableModel):
    title = models.CharField(max_length=100, blank=False, null=False)
    description = models.CharField(max_length=100, blank=False, null=False)
    start_time = models.TimeField()
    end_time = models.TimeField()

    resource_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    resource_id = models.PositiveIntegerField()
    content_resource = GenericForeignKey("resource_type", "resource_id")

    class Meta:
        db_table = "scheduled_event"
        indexes = [
            models.Index(
                fields=[
                    "resource_type",
                    "resource_id",
                ]
            ),
        ]


class Trip(LoggableModel):
    destination = models.TextField(blank=False, null=False)
    image = models.ImageField(upload_to="scheduled_events/trip/", blank=True, null=True)

    class Meta:
        db_table = "trip"


class Keynote(LoggableModel):
    speaker = models.TextField()

    class Meta:
        db_table = "keynote"
