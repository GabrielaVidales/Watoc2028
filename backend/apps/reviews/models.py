from django.db import models
from django.contrib.auth import get_user_model
from apps.abstracts.models import Abstract

User = get_user_model()


class Status(models.TextChoices):
    PENDING = "pending", "En revisión"
    ACCEPTED = "accepted", "Aceptado"
    DECLINED = "declined", "Rechazado"
    COMPLETED = "completed", "Completado"
    CANCELLED = "cancelled", "Cancelado"


class ReviewAssignment(models.Model):
    class Meta:
        db_table = "review_assignment"
        ordering = ["created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "abstract"],
                name="unique_user_abstract_review_assignment",
            )
        ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="review_assignments",
    )
    abstract = models.ForeignKey(
        Abstract,
        on_delete=models.CASCADE,
        related_name="review_assignments",
    )
    assigned_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name="assigned_reviews",
        null=True,
    )
    due_date = models.DateTimeField(
        db_column="due_date",
    )
    status = models.CharField(
        max_length=16,
        db_column="status",
        choices=Status.choices,
        default=Status.PENDING,
    )
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
    
    def __str__(self):
        title = self.abstract.get_plain_title()
        truncated_title = (title[:32] + "...") if len(title) > 35 else title
        return f'ReviewAssignment(abstract={truncated_title}, user={self.user.get_full_name()})'


class Review(models.Model):
    class Meta:
        db_table = "reviews"
        ordering = ["submitted_at"]

    assignment = models.ForeignKey(
        ReviewAssignment,
        on_delete=models.CASCADE,
        related_name="reviews",
    )
    status = models.CharField(
        max_length=16,
        db_column="status",
        choices=Status.choices,
        default=Status.PENDING,
    )
    comments = models.TextField()
    suggestions = models.TextField()
    submitted_at = models.DateTimeField(
        db_column="created_at",
        auto_now_add=True,
    )
