from django.db import models
from django.contrib.auth import get_user_model
from .text_choices import Nationality, AbstractPresentation, AbstactStatus
import html, bleach, uuid, hashlib, json

User = get_user_model()


class Abstract(models.Model):
    class Meta:
        db_table = "abstract"
        db_table_comment = "Contenido de los abstracts guardados."
        ordering = ["-created_at"]
        get_latest_by = "last_update"

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name="abstracts",
        null=True,
    )
    title = models.TextField(
        db_column="title",
        verbose_name="Título",
        blank=True,
    )
    text = models.TextField(
        db_column="text",
        verbose_name="Texto",
        blank=True,
    )
    references = models.TextField(
        db_column="references",
        verbose_name="Referencias",
        blank=True,
    )
    presentation_type = models.CharField(
        max_length=10,
        db_column="presentation",
        verbose_name="Tipo de presentación",
        choices=AbstractPresentation.choices,
        default=AbstractPresentation.NOT_SET,
    )
    status = models.CharField(
        max_length=16,
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
    is_editable = models.BooleanField(
        null=True,
        blank=True,
    )

    def get_plain_title(self):
        unescaped_title = html.unescape(self.title)
        clean_title = bleach.clean(unescaped_title, [], strip=True)
        return clean_title

    def get_hash(self):
        data = {
            "title": self.title,
            "content": self.text,
            "references": self.references,
            "authors": list(self.authors.values_list("id", flat=True)),
            "presentation_type": self.get_presentation_type_display(),
        }
        serialized = json.dumps(
            data,
            sort_keys=True,
            default=str,
            separators=(",", ":"),
        )
        hash = hashlib.sha256(serialized.encode("utf-8"))
        return hash.hexdigest()

    def __str__(self):
        title = self.get_plain_title()
        truncated_title = (title[:47] + "...") if len(title) > 50 else title
        username = self.user.email if self.user else "Sin Autor"
        return f"{truncated_title} | {username}"


class Affiliation(models.Model):
    class Meta:
        db_table = "affiliations"
        ordering = ["-updated_at"]

    institution = models.CharField(
        max_length=100,
        blank=True,
    )
    country = models.CharField(
        max_length=5,
        choices=Nationality.choices,
        default=Nationality.MEXICO,
    )
    city = models.CharField(
        max_length=30,
        blank=False,
        default="",
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="created_affiliations",
        db_column="created_by",
        null=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.institution}, {self.city}, {self.get_country_display()})"


class Author(models.Model):
    class Meta:
        db_table = "authors"
        ordering = ["order"]

    abstract = models.ForeignKey(
        Abstract,
        on_delete=models.CASCADE,
        related_name="authors",
    )
    affiliation = models.ForeignKey(
        Affiliation,
        on_delete=models.SET_NULL,
        related_name="authors",
        null=True,
    )
    related_user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name="related_user",
        null=True,
    )
    first_name = models.CharField(
        null=False,
        blank=True,
        max_length=128,
    )
    last_name = models.CharField(
        null=False,
        blank=True,
        max_length=128,
    )
    order = models.PositiveSmallIntegerField(
        db_column="order",
        null=False,
    )
    email = models.EmailField(blank=True)
    editable = models.BooleanField(default=True)
    is_corresponding_author = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        string = f"{self.first_name} {self.last_name} ({self.email})"
        if not self.editable:
            string += ' [readonly]'
        return string


class AbstractDeclaration(models.Model):
    class Meta:
        db_table = "abstract_declarations"

    abstract = models.OneToOneField(
        Abstract,
        primary_key=True,
        on_delete=models.CASCADE,
        related_name="declarations",
        default=None,
    )
    confirm_accuracy = models.BooleanField(
        default=False,
        verbose_name="Information Correctness",
        help_text="I confirm that I have reviewed this abstract and that all information is correct. I acknowledge that the content cannot be edited after final submission and will be published exactly as submitted.",
    )
    consent_publication = models.BooleanField(
        default=False,
        verbose_name="Consent to Publication",
        help_text="The submission of an abstract constitutes your consent to publication (e.g. congress website, programme, other promotions, etc.).",
    )
    submit_on_behalf = models.BooleanField(
        default=False,
        verbose_name="Submit on behalf of all authors",
        help_text="I confirm that I submit this abstract on behalf of all authors. The contact details saved are those of the first author, who is responsible for informing the others.",
    )
    commitment_attendance = models.BooleanField(
        default=False,
        verbose_name="Commitment to Attend",
        help_text="The abstract submission constitutes a formal commitment by the first author to physically attend the ECP and present the abstract in the assigned session.",
    )
    not_previously_published = models.BooleanField(
        default=False,
        verbose_name="Not Previously Published",
        help_text="I herewith confirm that the abstract has not been previously published.",
    )
    no_ai_used = models.BooleanField(
        default=False,
        verbose_name="No AI Tools Used",
        help_text="I herewith confirm that the abstract was prepared without using the aid of AI tools (such as, but not limited to, ChatGPT).",
    )


class PDFGenerationJob(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending"
        GENERATING = "generating"
        COMPLETED = "completed"
        FAILED = "failed"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    abstract = models.ForeignKey(
        Abstract,
        on_delete=models.CASCADE,
        related_name="pdf_generation_jobs",
    )
    content_hash = models.CharField(
        max_length=64,
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    file = models.FileField(
        upload_to="generated/",
        null=True,
        blank=True,
    )
    error = models.TextField(
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
