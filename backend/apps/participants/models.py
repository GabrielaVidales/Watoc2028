from django.db import models
from apps.participants.text_choices import DietaryRestrictionsList, FoodAllergiesList
from django.contrib.auth import get_user_model
from config.common.nationality import Nationality

User = get_user_model()


class Participant(models.Model):
    class Meta:
        db_table = "participant"

    user = models.OneToOneField(
        User,
        primary_key=True,
        on_delete=models.CASCADE,
        related_name="participant",
    )
    job_title = models.CharField(
        max_length=100,
        blank=True,
    )
    field_of_study = models.CharField(
        max_length=100,
        blank=True,
    )
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
        blank=True,
        default="",
    )
    student_proof = models.FileField(
        upload_to="users/student_proof/",
        blank=True,
        null=True,
        default=None,
    )
    invitation_letter = models.FileField(
        upload_to="users/invitation_letter/",
        blank=True,
        default=None,
    )
    needs_invitation_letter = models.BooleanField(
        default=False,
    )

    def __str__(self):
        return f"Participant({self.user.email}) [{self.institution}|{self.job_title}] — {self.field_of_study}"


class Dinner(models.Model):
    participant = models.OneToOneField(
        Participant,
        primary_key=True,
        on_delete=models.CASCADE,
    )
    will_assist_dinner = models.BooleanField(
        default=False,
    )
    has_dietary_restriction = models.BooleanField(
        default=False,
    )
    dietary_needs = models.CharField(
        max_length=10,
        blank=True,
        choices=DietaryRestrictionsList.choices,
        default=DietaryRestrictionsList.DEFAULT,
    )
    other_dietary_needs = models.CharField(
        max_length=75,
        blank=True,
    )
    has_food_allergy = models.BooleanField(
        default=False,
    )
    food_allergies = models.CharField(
        max_length=10,
        blank=True,
        choices=FoodAllergiesList.choices,
        default=FoodAllergiesList.DEFAULT,
    )
    other_allergies = models.CharField(
        max_length=100,
        blank=True,
    )
    
    def __str__(self):
        return f'<Dinner details for {self.participant.user.get_full_name()}>'


class Tour(models.Model):
    name = models.CharField(max_length=48, blank=False)
    description = models.TextField()
    image = models.ImageField(upload_to="tours/image/", blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"[{self.pk}] Tour {self.name} (${self.price} MXN): {self.description[:50] + '...' if len(self.description) > 50 else ''}"
