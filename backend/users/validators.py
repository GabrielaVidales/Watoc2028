import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _
from django.core.validators import RegexValidator

REGEX_NAME = r"^([a-zA-ZÀ-ú]{2,})([ -]?[a-zA-ZÀ-ú]{2,})*$"
REGEX_EMAIL = r"^([a-zA-Z].[\w]+(?:\.\w+)?)+@([\w]+(?:\.[a-z]{2,10})+)$"

valid_name = RegexValidator(
    regex=REGEX_NAME,
    message="Este nombre no es válido",
)


valid_email = RegexValidator(
    regex=REGEX_EMAIL,
    message="Este email no es válido",
)


class PasswordValidator:
    def validate(self, password, user=None):
        if len(password) < 8:
            raise ValidationError(_("Minimum 8 characters"), code="password_too_short")
        if len(password) > 100:
            raise ValidationError(_("Password too long"), code="password_too_long")

        if not re.search(r"[A-Z]", password):
            raise ValidationError(_("Must contain at least one uppercase letter"), code="password_no_upper")

        if not re.search(r"[a-z]", password):
            raise ValidationError(_("Must contain at least one lowercase letter"), code="password_no_lower")

        if not re.search(r"[0-9]", password):
            raise ValidationError(_("Must contain at least one digit"), code="password_no_digit")

        if not re.search(r"[^A-Za-z0-9]", password):
            raise ValidationError(_("Must contain one special character"), code="password_no_special")

    def get_help_text(self):
        return _(
            "Tu contraseña debe tener entre 8 y 100 caracteres, incluir mayúsculas, minúsculas, números y un carácter especial."
        )
