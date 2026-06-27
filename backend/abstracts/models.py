from django.db import models
from users.models import Abstract, User
from .text_choices import (
    Nationality,
    PrefixType,
    AbstractPresentation,
    AbstactStatus,
    DietaryRestrictionsList,
    FoodAllergiesList,
)


# Create your models here.
class Affiliation(models.Model):
    class Meta:
        db_table = "affiliations"
        ordering = ["institution"]
    
    institution = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=5, choices=Nationality.choices, default=Nationality.MEXICO)
    city = models.CharField(max_length=30, blank=False, default="")
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="created_affiliations",
        db_column="created_by",
        null=True,
    )
