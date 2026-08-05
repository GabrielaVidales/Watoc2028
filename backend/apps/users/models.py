from django.contrib.auth.models import AbstractUser
from django.db import models
from .managers import CustomUserManager
from .text_choices import Nationality, PrefixType
import os


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
    middle_name = models.CharField(max_length=100, blank=True, default="")
    prefix = models.CharField(max_length=10, choices=PrefixType.choices, default=PrefixType.PROF)
    pronouns = models.CharField(max_length=50, blank=True, default="")
    nationality = models.CharField(max_length=5, choices=Nationality.choices, default=Nationality.MEXICO)
    city = models.CharField(max_length=30, blank=False)
    photo = models.ImageField(upload_to="users/photos/", blank=True, null=True)
    objects = CustomUserManager()
    email_verified = models.BooleanField(default=False)

    @property
    def full_name(self):
        middle_initial = f"{self.middle_name.strip()[0].upper()}." if self.middle_name and self.middle_name.strip() else ""
        parts = [self.first_name, middle_initial, self.last_name]
        full_name = " ".join(p.strip() for p in parts if p and p.strip())
        return full_name

    @property
    def roles(self):
        roles = [role.name for role in self.groups.all()]
        return roles

    def __str__(self):
        return self.email
