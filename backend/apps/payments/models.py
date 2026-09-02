from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()


class PaymentStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    PAID = "paid", "Paid"
    FAILED = "failed", "Failed"
    CANCELED = "canceled", "Canceled"


class Payment(models.Model):
    """
    Esta clase sirve para tener un seguimiento en el sistema de los pagos con Stripe que se han efectuado.

    Atributos:
    - user: indica a qué usuario le pertenece el intento de pago
    - stripe_session_id: sirve para recuperar la sesión de pago que se genero en Stripe
    - payment_intent_id: sirve para recuperar la acción de pago que se generó en Stripe
    - status: indica el estado actual del pago ("pending" | "paid" | "failed" | "canceled")
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="payments",
        null=True,
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
    status = models.CharField(
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Payment ID: {self.pk}"


class StripeWebhookEvent(models.Model):
    id = models.CharField(
        max_length=255,
        primary_key=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Idempotency({self.id})"
