from django.shortcuts import render


def preview_contact_email(request):
    return render(
        request,
        "emails/change_password_email.html",
        {
            "first_name": "Juan",
            "last_name": "Pérez",
            "email": "juan@example.com",
            "reset_password_url": "https://watoc2028.org/reset-password?token=lalsdhasd8sadasodasld",
            "expiration_hours": 24,  # o 1, 2, etc.
            "support_url": "https://watoc2028.org/support",
        },
    )
