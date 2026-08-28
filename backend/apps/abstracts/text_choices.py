from django.db.models import TextChoices
from django.utils.translation import gettext_lazy as _


class AbstractPresentation(TextChoices):
    NOT_SET = "", _("Not set")
    ORAL = "oral", "Oral Presentation Preferred"
    POSTER = "poster", "Poster Presentation Preferred"


class AbstactStatus(TextChoices):
    DELETED = "deleted", "Eliminado"
    DRAFT = "draft", "Borrador"
    SUBMITTED = "submitted", "Enviado / En revisión"
    ACCEPTED = "accepted", "Aceptado"
    REJECTED = "rejected", "Rechazado"

