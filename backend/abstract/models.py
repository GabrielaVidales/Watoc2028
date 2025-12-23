from django.db import models
from django.conf import settings

class Abstract(models.Model):
    # Definimos las opciones para Presentation Type
    class PresentationType(models.TextChoices):
        ORAL = 'oral', 'Oral'
        ORAL_DEFAULT_POSTER = 'oral_default_poster', 'Oral (Default Poster)'
        POSTER = 'poster', 'Poster'
        YOUNG_ORAL = 'young_oral', 'Young Oral'
        YOUNG_ORAL_DEFAULT_POSTER = 'young_oral_default_poster', 'Young Oral (Default Poster)'

    # Definimos las opciones para Status
    class Status(models.TextChoices):
        SUBMITTED = 'submitted', 'Submitted'
        UNDER_REVIEW = 'under_review', 'Under Review'
        ACCEPTED = 'accepted', 'Accepted'
        REJECTED = 'rejected', 'Rejected'

    # ForeignKey para permitir múltiples abstracts por usuario.
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='abstracts' 
    )

    # co_authors
    co_authors = models.TextField(help_text="Lista de coautores")

    presentation_type = models.CharField(
        max_length=50,
        choices=PresentationType.choices,
        default=PresentationType.POSTER 
    )

    # abstract: file
    abstract_file = models.FileField(upload_to='abstracts/files/')

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.SUBMITTED
    )

    # submission_date (DEFAULT)
    submission_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Abstract: {self.get_presentation_type_display()} by {self.user.email}"
