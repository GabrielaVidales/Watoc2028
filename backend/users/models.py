from django.contrib.auth.models import AbstractUser
from django.db import models
from .managers import CustomUserManager
from .text_choices import Nationality, PrefixType, AbstractPresentation, AbstactStatus


class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    middle_name = models.CharField(max_length=100, blank=True, default='')

    prefix = models.CharField(max_length=10, choices=PrefixType.choices, default=PrefixType.PROF)
    pronouns = models.CharField(max_length=50, blank=True, default='')

    nationality = models.CharField(max_length=5, choices=Nationality.choices, default=Nationality.MEXICO)
    city = models.CharField(max_length=30, blank=False)

    photo = models.ImageField(upload_to="users/photos/", blank=True, null=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.email

    @property
    def roles(self):
        roles = [role.name for role in self.groups.all()]
        return roles

    def __str__(self):
        return self.email


class Participant(models.Model):
    user = models.OneToOneField(
        User,
        primary_key=True,
        on_delete=models.CASCADE,
    )
    affiliation = models.CharField(max_length=100, blank=True)
    job_title = models.CharField(max_length=100, blank=True)
    field_of_study = models.CharField(max_length=100, blank=True)
    
    needs_visa = models.BooleanField(default=False)
    invitation_letter = models.FileField(upload_to="users/photos/", blank=True, null=True, default=None)
    
    going_to_dinner = models.BooleanField(default=False)

    def __str__(self):
        return f"Participant({self.user.email}) [{self.affiliation}|{self.job_title}] — {self.field_of_study}"


class Abstract(models.Model):
    class Meta:
        db_table = "abstract"
        db_table_comment = "Contenido de los abstracts guardados."
        ordering = ["-created_at"]
        get_latest_by = "last_update"

    title = models.CharField(db_column="title", verbose_name="Título", max_length=128)
    text = models.TextField(db_column="text", verbose_name="Texto")
    references = models.TextField(db_column="references", verbose_name="Referencias")
    user = models.ForeignKey(User, on_delete=models.SET_NULL, related_name="abstracts", null=True)
    presentation_type = models.CharField(db_column="presentation", verbose_name="Tipo de presentación", choices=AbstractPresentation.choices, default=AbstractPresentation.POSTER)
    status = models.CharField(
        db_column="status",
        verbose_name="Estado del abstract",
        choices=AbstactStatus.choices,
        default=AbstactStatus.DRAFT,
    )
    created_at = models.DateTimeField(
        db_column="created_at",
        verbose_name="Fecha de creación",
        auto_now_add=True,
    )
    last_update = models.DateTimeField(
        db_column="last_update",
        verbose_name="Última actualización",
        auto_now=True,
        null=True,
    )
    last_review_at = models.DateTimeField(
        db_column="last_review_at",
        null=True,
        blank=True,
    )

    def __str__(self):
        truncated_title = (self.title[:47] + "...") if len(self.title) > 50 else self.title
        username = self.user.email if self.user else "Sin Autor"
        return f"{truncated_title} | {username}"


class Author(models.Model):
    name = models.CharField(db_column="name", null=False, blank=False)
    order = models.PositiveSmallIntegerField(db_column="order", null=False, blank=False)
    is_corresponding = models.BooleanField(db_column="is_corresponding", default=False)
    abstract = models.ForeignKey(
        Abstract,
        on_delete=models.CASCADE,
        related_name="authors",
        db_column="abstract",
        null=False,
        blank=False,
    )

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.name


class Dinner(models.Model):
    participant = models.OneToOneField(
        Participant,
        primary_key=True,
        on_delete=models.CASCADE,
        default=None
    )

