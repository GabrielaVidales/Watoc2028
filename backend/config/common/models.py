from django.db import models


class LoggableModel(models.Model):
    last_update = models.DateTimeField(
        db_column="last_update",
        auto_now=True,
    )
    created_at = models.DateTimeField(
        db_column="created_at",
        auto_now_add=True,
    )
    is_active = models.BooleanField(
        db_column="is_active",
    )

    class Meta:
        abstract = True
        ordering = ["-last_update"]
