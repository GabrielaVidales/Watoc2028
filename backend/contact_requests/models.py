from django.db import models


class ContactRequest(models.Model):
    class ContactType(models.IntegerChoices):
        POSTERS = 0, "Posters"
        TALKS = 1, "Talks"
        VISA_LETTERS = 2, "Visa Letters"
        PAYMENTS = 3, "Payments"
        OTHERS = 4, "Others"

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.PositiveSmallIntegerField(
        choices=ContactType.choices, default=ContactType.OTHERS
    )
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "contact_requests"
        ordering = ["-created_at"]
        verbose_name = "Contact Request"
        verbose_name_plural = "Contact Requests"

    def __str__(self):
        return f"From: {self.first_name} {self.last_name} — Subject: {self.get_subject_display()}"
