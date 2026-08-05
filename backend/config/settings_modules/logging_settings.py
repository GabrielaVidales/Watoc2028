from pathlib import Path


def get_logging_settigns(BASE_DIR: Path):
    log_dir = BASE_DIR / "logs"
    log_dir.mkdir(parents=True, exist_ok=True)

    return {
        "version": 1,
        "disable_existing_loggers": False,
        # Formato de los logs
        "formatters": {
            "verbose": {
                "format": "{levelname} {asctime} {module} {process:d} {thread:d} {message}",
                "style": "{",
            },
            "simple": {
                "format": "{levelname} {asctime} {message}",
                "style": "{",
            },
            "detailed": {
                "format": "[{levelname}] {asctime} — {message}",
                "style": "{",
            },
        },
        # Handlers (dónde se envían los logs)
        "handlers": {
            # Console output
            "console": {
                "class": "logging.StreamHandler",
                "formatter": "simple",
                "level": "DEBUG",
            },
            # Archivo general
            "file": {
                "class": "logging.handlers.RotatingFileHandler",
                "filename": log_dir / "django.log",
                "maxBytes": 1024 * 1024 * 10,  # 10 MB
                "backupCount": 5,
                "formatter": "verbose",
                "level": "INFO",
                "encoding": "utf-8",
            },
            # Archivo solo para errores
            "error_file": {
                "class": "logging.handlers.RotatingFileHandler",
                "filename": log_dir / "errors.log",
                "maxBytes": 1024 * 1024 * 10,
                "backupCount": 5,
                "formatter": "verbose",
                "level": "ERROR",
                "encoding": "utf-8",
            },
            # Archivo específico para password reset
            "password_reset_file": {
                "class": "logging.handlers.RotatingFileHandler",
                "filename": log_dir / "password_reset.log",
                "maxBytes": 1024 * 1024 * 5,  # 5 MB
                "backupCount": 3,
                "formatter": "detailed",
                "level": "INFO",
                "encoding": "utf-8",
            },
            # Archivo específico para logs de abstracts
            "abstracts_file": {
                "class": "logging.handlers.RotatingFileHandler",
                "filename": log_dir / "abstracts.log",
                "maxBytes": 1024 * 1024 * 5,  # 5 MB
                "backupCount": 3,
                "formatter": "detailed",
                "level": "INFO",
                "encoding": "utf-8",
            },
            # Archivo específico para logs de notificaciones
            "notifications_file": {
                "class": "logging.handlers.RotatingFileHandler",
                "filename": log_dir / "notifications.log",
                "maxBytes": 1024 * 1024 * 5,  # 5 MB
                "backupCount": 3,
                "formatter": "detailed",
                "level": "INFO",
                "encoding": "utf-8",
            },
        },
        "loggers": {
            # Logger raíz
            "": {
                "handlers": ["console"],
                "level": "INFO",
            },
            # Django interno
            "django": {
                "handlers": ["console", "file"],
                "level": "INFO",
                "propagate": False,
            },
            "apps.users": {
                "handlers": ["console", "file"],
                "level": "INFO",
                "propagate": False,
            },
            "apps.abstracts": {
                "handlers": ["abstracts_file"],
                "level": "INFO",
                "propagate": False,
            },
            "apps.notifications": {
                "handlers": ["notifications_file"],
                "level": "INFO",
                "propagate": True,
            },
        },
    }
