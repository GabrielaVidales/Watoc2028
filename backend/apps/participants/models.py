from django.db import models
from apps.participants.text_choices import DietaryRestrictionsList, FoodAllergiesList
from django.contrib.auth import get_user_model

User = get_user_model()


class Participant(models.Model):
    class Meta:
        db_table = "participant"

    user = models.OneToOneField(User, primary_key=True, on_delete=models.CASCADE, related_name="participant")
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
