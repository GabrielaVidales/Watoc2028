from django.db import models
from django.conf import settings
    
class Participant(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='participant_profile' # <--- Único para participantes
    )
    
    affiliation = models.CharField(max_length=255)
    affiliation_department = models.CharField(max_length=255)

    def __str__(self):
        return f"Participant: {self.user.email}"    
