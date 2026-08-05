from datetime import timedelta

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "config.authentication.CustomJWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ),
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",  # Para usuarios no logueados
        "rest_framework.throttling.UserRateThrottle",  # Para usuarios logueados
        "utils.throttles.DailyAnonThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "60/minute",
        "anon_daily": "300/day",
        "user": "2000/day",  # 1000 peticiones por día para usuarios
    },
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

SPECTACULAR_SETTINGS = {
    "TITLE": "WATOC 2028 Backend",
    "DESCRIPTION": "Official backend of WATOC 2028, the triennial congress of the World Association of Theoretical and Computational Chemists, hosted in Mérida, Yucatán, Mexico.",
    "VERSION": "1.0.0",
    "SECURITY": [
        {
            "BearerAuth": [],
        }
    ],
    "COMPONENTS": {
        "securitySchemes": {
            "BearerAuth": {
                "type": "http",
                "scheme": "bearer",
                "bearerFormat": "JWT",
            }
        }
    },
}


def get_simple_jwt_settings(SECRET_KEY: str):
    return {
        "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
        "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
        "ROTATE_REFRESH_TOKENS": True,
        "BLACKLIST_AFTER_ROTATION": True,
        "ALGORITHM": "HS256",
        "SIGNING_KEY": SECRET_KEY,
        "VERIFYING_KEY": None,
        "USER_ID_FIELD": "id",
        "USER_ID_CLAIM": "user_id",
    }
