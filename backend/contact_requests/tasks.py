from celery import shared_task
from .models import ContactRequest
from django.conf import settings
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives

# Cuando un usuario envía un formulario de contacto, se notifica
# por correo al correo de administración del proyecto
@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_kwargs={"max_retries": 3},
)
def send_contact_request_email(self, instance_id):
    instnc = ContactRequest.objects.get(pk=instance_id)
    subject = f"Solicitud de Contacto: {instnc.subject} - {instnc.firstName} {instnc.lastName}"
    text_content = f"""
Estimado administrador,

Se ha recibido una nueva solicitud de contacto a través del sitio web.

Nombre: {instnc.firstName} {instnc.lastName}
Correo: {instnc.email}
Asunto: {instnc.subject}

Mensaje:
{instnc.message}
"""
    html_content = render_to_string(
        "emails/new_contact.html",
        {
            "first_name": instnc.firstName,
            "last_name": instnc.lastName,
            "email": instnc.email,
            "subject": subject,
            "message": instnc.message,
        },
    )
    email = EmailMultiAlternatives(
        subject="Nueva solicitud de contacto",
        body=text_content,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[settings.EMAIL_HOST_USER],
    )
    email.attach_alternative(html_content, "text/html")
    email.send()
    return f"Correo enviado para ContactRequest #{instance_id}"

