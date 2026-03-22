from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()


class Payment(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="payments",
        null=True,
    )
    payment_id = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
    )
    stripe_session_id = models.CharField(   
        max_length=255,
        unique=True,
        null=True,
        blank=True,
    )
    payment_intent_id = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        unique=True,
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default="usd")
    is_paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment ID: {self.payment_id}, Amount: {self.amount}"
