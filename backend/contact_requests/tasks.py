from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings


@shared_task
def send_mail_async(
    subject: str,
    message: str,
    recipient_list: list[str] = [settings.DEFAULT_FROM_EMAIL],
):
    try:
        send_mail(
            subject,
            message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipient_list,
            fail_silently=False,
        )
    except Exception as e:
        print(f"--- ERROR AL ENVIAR: {e} ---")
