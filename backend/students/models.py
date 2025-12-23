from django.db import models
from django.conf import settings

class Student(models.Model):
    # Relación 1 a 1, siendo también la Primary Key
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='student_profile' # <--- Único para estudiantes
    )

    university = models.CharField(max_length=100)
    # FileField es mejor para documentos. Requiere 'upload_to'.
    proof_document = models.FileField(upload_to='students/documents/') 
    
    def __str__(self):
        return f"Student: {self.user.email}"    

