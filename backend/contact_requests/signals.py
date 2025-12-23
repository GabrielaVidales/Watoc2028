from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import ContactRequest

@receiver(post_save, sender=ContactRequest)
def send_contact_email(sender, instance, created, **kwargs):
    print(f"--- SIGNAL DISPARADO: Created={created} ---")

    if created:
        # Enviar correo al admin avisando del nuevo mensaje
        subject = f"Solicitud de Contacto: {instance.type} - {instance.first_name} {instance.last_name}"

        message = f"""
        Estimado administrador,

        Se ha recibido una nueva solicitud de contacto a través del sitio web. 
        A continuación se detallan los datos del remitente:

        -------------------------------------------------------
        INFORMACIÓN DEL CONTACTO
        -------------------------------------------------------
        • Nombre:   {instance.first_name} {instance.last_name}
        • Correo:   {instance.email}
        • Asunto:   {instance.type}
        -------------------------------------------------------

        MENSAJE DEL USUARIO:
        "{instance.question}"

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