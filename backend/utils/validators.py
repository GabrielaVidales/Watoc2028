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