from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from config.common.models import LoggableModel


class Tag(models.Model):
    description = models.CharField(
        max_length=64,
        blank=False,
        null=False,
        unique=True,
    )

    class Meta:
        db_table = "tag"
        ordering = ["-description"]

    def __str__(self):
        return f"Tag({self.description})"


class ScheduledEvent(LoggableModel):
    title = models.TextField(
        max_length=100,
        blank=False,
        null=False,
    )
    description = models.TextField(
        max_length=100,
        blank=False,
        null=False,
    )
    image = models.ImageField(
        upload_to="scheduled_events/images/",
        blank=True,
        null=True,
    )
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    lounge = models.CharField(
        max_length=100,
        blank=False,
        null=False,
    )
    tags = models.ManyToManyField(
        Tag,
        related_name="scheduled_events",
        blank=True,
    )
    resource_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
    )
    content_resource = GenericForeignKey(
        "resource_type",
        "resource_id",
    )
    resource_id = models.PositiveIntegerField()

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
