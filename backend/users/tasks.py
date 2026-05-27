from celery import shared_task
from django.conf import settings
from .models import User
from itsdangerous import URLSafeTimedSerializer
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives

serializer = URLSafeTimedSerializer(settings.SECRET_KEY)


@shared_task(autoretry_for=(Exception,), retry_backoff=True, retry_kwargs={"max_retries": 3})
def send_email_confirmation_email(user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return "User not found"

    token = serializer.dumps(
        {
            "user_id": user.id,
            "email": user.email,
        },
        salt="email-verification",
    )
    verification_url = f"https://{settings.DOMAIN}/auth/verify?token={token}"
    text_content = f"""Hello { user.first_name } { user.last_name },
Thank you for registering for WATOC 2028 using the following email address:

{ user.email }

To activate your account and verify your email address, please open the following link in your browser:

{ verification_url }

If you did not create this account, you can safely ignore this email.

© 2025 WATOC 2028
"""
    html_content = render_to_string(
        "emails/verify_email.html",
        {
            "verification_url": verification_url,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
        },
    )
    email = EmailMultiAlternatives(
        subject="<no-reply> — Please verify your email",
        body=text_content,
        to=[user.email],
        from_email=settings.DEFAULT_FROM_EMAIL,
    )
    email.attach_alternative(html_content, "text/html")
    email.send()
    return f"Correo de verificación enviado a {user.email}"


@shared_task(autoretry_for=(Exception,), retry_backoff=True, retry_kwargs={"max_retries": 3})
def send_reset_password_email(user_email, signature):
    try:
        user = User.objects.get(email=user_email)
    except User.DoesNotExist:
        return "User not found"

    token = serializer.dumps(
        {"user_id": user.id, "email": user_email, "password_signature": signature},
        salt="password-reset",
    )
    verification_url = f"https://{settings.DOMAIN}/auth/reset-password?token={token}"
    text_content = f"""To reset your password, please open the following link in your browser:

{ verification_url }

If you did not create this account, you can safely ignore this email.

© 2025 WATOC 2028
"""

    html_content = render_to_string(
        "emails/change_password_email.html",
        {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "reset_password_url": verification_url,
            "expiration_hours": 24,
        },
    )
    email = EmailMultiAlternatives(
        subject="<no-reply> — Please verify your email",
        body=text_content,
        to=[user.email],
        from_email=settings.DEFAULT_FROM_EMAIL,
    )
    email.attach_alternative(html_content, "text/html")
    email.send()
    return f"Correo de verificación enviado a {user.email}"
