from django.db import models

from django.db import models
from django.conf import settings

class Payment(models.Model):
    # Django crea un ID (PK) automáticamente, pero si quieres ser explícito:
    # id = models.AutoField(primary_key=True)

    status = models.CharField(max_length=50)
    
    # UNIQUE
    transaction_token = models.CharField(max_length=255, unique=True)
    
    # DEFAULT (auto_now_add pone la fecha de creación automáticamente)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # FK, UNIQUE (Un OneToOneField en Django es una ForeignKey con unique=True)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='payments'
    )

    def __str__(self):
        return f"Payment {self.id} - {self.user.email} - {self.status}"
