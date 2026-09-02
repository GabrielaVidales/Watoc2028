from corsheaders.defaults import default_headers
import os

CORS_ALLOW_ALL_ORIGINS = os.getenv("DEBUG", "") in ["True", "true", "1"]
CORS_ALLOW_CREDENTIALS = os.getenv("CORS_ALLOW_CREDENTIALS", "") in ["True", "true", "1"]
CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "").split(",")
CORS_ALLOW_HEADERS = [
    *default_headers,
    "idempotency-key",
]
