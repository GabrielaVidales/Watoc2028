from django.db import models

from django.db import models

class ContactRequest(models.Model):
    # Opciones para el campo ENUM
    class ContactType(models.TextChoices):
        POSTERS = 'posters', 'Posters'
        TALKS = 'talks', 'Talks'
        VISA_LETTERS = 'visa_letters', 'Visa Letters'
        PAYMENTS = 'payments', 'Payments'
        OTHERS = 'others', 'Others'

    # ID (PK) lo maneja Django automáticamente
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    
    # Campo tipo ENUM usando choices
    type = models.CharField(
        max_length=20,
        choices=ContactType.choices,
        default=ContactType.OTHERS
    )
    
    question = models.TextField()
    
    # contact_date (DEFAULT)
    contact_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Contact Request"
        verbose_name_plural = "Contact Requests"

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.type}"
