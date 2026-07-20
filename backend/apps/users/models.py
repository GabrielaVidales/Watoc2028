from django.contrib.auth.models import AbstractUser
from django.db import models
from .managers import CustomUserManager
from .text_choices import (
    Nationality,
    PrefixType,
    DietaryRestrictionsList,
    FoodAllergiesList,
)


class User(AbstractUser):
    username = None
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        db_table = "user"
        ordering = ["email"]
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"

    email = models.EmailField(
        unique=True,
        blank=False,
        null=False,
        error_messages={
            "unique": "This email is already registered.",
            "invalid": "That email format looks wrong.",
        },
    )

    # region Otros atributos...
    middle_name = models.CharField(max_length=100, blank=True, default="")

    prefix = models.CharField(max_length=10, choices=PrefixType.choices, default=PrefixType.PROF)
    pronouns = models.CharField(max_length=50, blank=True, default="")

    nationality = models.CharField(max_length=5, choices=Nationality.choices, default=Nationality.MEXICO)
    city = models.CharField(max_length=30, blank=False)

    photo = models.ImageField(upload_to="users/photos/", blank=True, null=True)

    objects = CustomUserManager()

    email_verified = models.BooleanField(default=False)
    # endregion

    @property
    def full_name(self):
        return f"{self.first_name} {self.middle_name} {self.last_name}".strip() or self.email

    @property
    def roles(self):
        roles = [role.name for role in self.groups.all()]
        return roles

    def __str__(self):
        return self.email


class Participant(models.Model):
    class Meta:
        db_table = "participant"

    user = models.OneToOneField(
        User,
        primary_key=True,
        on_delete=models.CASCADE,
        related_name='participant'
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


class Tour(models.Model):
    name = models.CharField(max_length=48, blank=False)
    description = models.TextField()
    image = models.ImageField(upload_to="tours/image/", blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"[{self.pk}] Tour {self.name} (${self.price} MXN): {self.description[:50] + '...' if len(self.description) > 50 else ''}"
