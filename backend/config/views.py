from django.shortcuts import render


def preview_contact_email(request):

    context = {
        "first_name": "Eduardo",
        "last_name": "Escalante",
        "email": "eduardo@gmail.com",
        "subject": "Solicitud de información",
        "message": """
Hola,

Me interesa participar en WATOC 2028.

Gracias.
        """,
    }

    return render(
        request,
        "emails/verify_email.html",
        context
    )