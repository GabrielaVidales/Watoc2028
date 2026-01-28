from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import ContactRequest

@receiver(post_save, sender=ContactRequest)
def send_contact_email(sender, instance, created, **kwargs):
    print(f"--- SIGNAL DISPARADO: Created={created} ---")
    opciones = {
        0: 'Posters',
        1: 'Talks',
        2: 'Visa Letters',
        3: 'Payments',
        4: 'Others'
    }
    subjectText = opciones.get(instance.subject,"Se envió un dato incorrecto")

    if created:
        # Enviar correo al admin avisando del nuevo mensaje
        subject = f"Solicitud de Contacto: {subjectText} - {instance.firstName} {instance.lastName}"

        message = f"""
        Estimado administrador,

        Se ha recibido una nueva solicitud de contacto a través del sitio web. 
        A continuación se detallan los datos del remitente:

        -------------------------------------------------------
        INFORMACIÓN DEL CONTACTO
        -------------------------------------------------------
        • Nombre:   {instance.firstName} {instance.lastName}
        • Correo:   {instance.email}
        • Asunto:   {subjectText}
        -------------------------------------------------------

        MENSAJE DEL USUARIO:
        "{instance.description}"

        -------------------------------------------------------
        Saludos,
        Tu Sistema de Notificaciones.
        """
        
        # Nota: Necesitas configurar EMAIL_HOST, EMAIL_PORT, etc. en settings.py
        try:
            print("--- Intentando enviar correo... ---")
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [settings.DEFAULT_FROM_EMAIL],
                fail_silently=False, 
            )
            print("--- CORREO ENVIADO ---")
        except Exception as e:
            print(f"--- ERROR AL ENVIAR: {e} ---")