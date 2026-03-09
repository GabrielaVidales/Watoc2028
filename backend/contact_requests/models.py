from django.db import models


class ContactRequest(models.Model):
    class ContactType(models.IntegerChoices):
        POSTERS = 0, "Posters"
        TALKS = 1, "Talks"
        VISA_LETTERS = 2, "Visa Letters"
        PAYMENTS = 3, "Payments"
        OTHERS = 4, "Others"

    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.PositiveSmallIntegerField(
        choices=ContactType.choices, default=ContactType.OTHERS
    )
    description = models.TextField()
    contact_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Contact Request"
        verbose_name_plural = "Contact Requests"

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.type}"
