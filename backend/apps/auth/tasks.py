from celery import shared_task
from django.conf import settings
from django.contrib.auth import get_user_model
from itsdangerous import URLSafeTimedSerializer
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives

User = get_user_model()

serializer = URLSafeTimedSerializer(settings.SECRET_KEY)


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
