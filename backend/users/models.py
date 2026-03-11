from django.contrib.auth.models import AbstractUser
from django.db import models
from .managers import CustomUserManager
from .text_choices import Nationality, PrefixType, AbstractPresentation, AbstactStatus, DietaryRestrictionsList, FoodAllergiesList


class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    middle_name = models.CharField(max_length=100, blank=True, default="")

    prefix = models.CharField(max_length=10, choices=PrefixType.choices, default=PrefixType.PROF)
    pronouns = models.CharField(max_length=50, blank=True, default="")

    nationality = models.CharField(max_length=5, choices=Nationality.choices, default=Nationality.MEXICO)
    city = models.CharField(max_length=30, blank=False)

    photo = models.ImageField(upload_to="users/photos/", blank=True, null=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    @property
    def full_name(self):
        return f"{self.prefix} {self.first_name} {self.middle_name} {self.last_name}".strip() or self.email

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
    invitation_letter = models.FileField(upload_to="users/invitation_letter/", blank=True, default=None)

    student_proof = models.FileField(upload_to="users/student_proof/", blank=True, null=True, default=None)

    def __str__(self):
        return f"Participant({self.user.email}) [{self.affiliation}|{self.job_title}] — {self.field_of_study}"


class Dinner(models.Model):
    participant = models.OneToOneField(Participant, primary_key=True, on_delete=models.CASCADE)
    will_assist_dinner = models.BooleanField(default=False)

    has_dietary_restriction = models.BooleanField(default=False)
    dietary_needs = models.CharField(
        max_length=10,
        blank=True,
        choices=DietaryRestrictionsList.choices,
        default=DietaryRestrictionsList.DEFAULT,
    )
    other_dietary_needs = models.CharField(max_length=75, blank=True)

    has_food_allergy = models.BooleanField(default=False)
    food_allergies = models.CharField(
        max_length=10,
        blank=True,
        choices=FoodAllergiesList.choices,
        default=FoodAllergiesList.DEFAULT,
    )
    other_allergies = models.CharField(max_length=100, blank=True)


class Abstract(models.Model):
    title = models.CharField(
        db_column="title",
        verbose_name="Título",
        max_length=128,
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
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name="abstracts",
        null=True,
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

    class Meta:
        db_table = "abstract"
        db_table_comment = "Contenido de los abstracts guardados."
        ordering = ["-created_at"]
        get_latest_by = "last_update"

    def __str__(self):
        truncated_title = (self.title[:47] + "...") if len(self.title) > 50 else self.title
        username = self.user.email if self.user else "Sin Autor"
        return f"{truncated_title} | {username}"


class AuthorAffiliation(models.Model):
    institute = models.CharField(max_length=100, blank=True)
    department = models.CharField(max_length=100, blank=True)
    nationality = models.CharField(max_length=5, choices=Nationality.choices, default=Nationality.MEXICO)
    city = models.CharField(max_length=30, blank=False, default="")

    abstract = models.ForeignKey(
        Abstract,
        on_delete=models.CASCADE,
        related_name="affiliations",
        db_column="abstract",
        null=True,
    )


class Author(models.Model):
    first_name = models.CharField(null=False, blank=True, max_length=128)
    last_name = models.CharField(null=False, blank=True, max_length=128)
    email = models.EmailField(blank=True)
    order = models.PositiveSmallIntegerField(db_column="order", null=False)
    abstract = models.ForeignKey(
        Abstract,
        on_delete=models.CASCADE,
        related_name="authors",
        db_column="abstract",
        null=False,
        blank=False,
    )

    affiliation = models.ForeignKey(AuthorAffiliation, on_delete=models.SET_NULL, related_name="authors", null=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"


class AbstractDeclarations(models.Model):
    abstract = models.OneToOneField(Abstract, primary_key=True, on_delete=models.CASCADE, default=None)
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

