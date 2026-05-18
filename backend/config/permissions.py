from rest_framework import permissions
from django.middleware.csrf import CsrfViewMiddleware
from rest_framework.exceptions import PermissionDenied


class HasCSRFToken(permissions.BasePermission):
    """
    Fuerza la validación de CSRF incluso para usuarios anónimos
    """

    def has_permission(self, request, view):
        if request.method in ("POST", "PUT", "PATCH", "DELETE"):
            # El middleware devuelve None si todo está OK, o un objeto HttpResponse si falla
            reason = CsrfViewMiddleware(lambda x: None).process_view(request, None, None, None)
            if reason:
                print(f"Fallo de CSRF detectado: {reason.reason_phrase}")
                raise PermissionDenied(
                    {
                        "code": "csrf_validation_failed",
                        "message": "CSRF token missing or invalid.",
                        "details": "A valid X-CSRFToken header is required for security purposes.",
                    }
                )

        return True

