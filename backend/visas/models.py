from django.db import models
from django.conf import settings

class Visa(models.Model):
    # ID (PK) - Django lo genera automáticamente como AutoField
    
    # Suponiendo que es un valor booleano (Sí/No)
    requires_visa = models.BooleanField(default=False)
    
    # Si es una ruta a un archivo PDF o imagen, usamos FileField
    invitation_letter = models.FileField(upload_to='visas/letters/', null=True, blank=True)
    
    # created_at (DEFAULT)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # user_ID (FK, UNIQUE)
    # Como es FK y UNIQUE, usamos OneToOneField
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='visa_info'
    )

    def __str__(self):
        return f"Visa info for {self.user.email}"
