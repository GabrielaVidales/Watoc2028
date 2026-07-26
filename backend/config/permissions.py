from rest_framework import permissions
from django.middleware.csrf import CsrfViewMiddleware
from rest_framework.exceptions import PermissionDenied
from django.middleware.csrf import get_token
from secrets import compare_digest


class HasCSRFToken(permissions.BasePermission):
    """
    Fuerza la validación de CSRF incluso para usuarios anónimos
    """

    def has_permission(self, request, view):
        if request.method in ("POST", "PUT", "PATCH", "DELETE"):
            # Si la request tiene deshabilitada este check se lo salta
            if request.dont_enforce_cookies:
                print("Mobile user -> Skip cookies check")
                return True

            # Obtener el CSRF token en header
            csrf_header = request.headers.get("X-CSRFToken")
            # Obtener el CSRF token en cookies
            csrf_cookie = request.COOKIES.get("csrftoken")

            # Se debe mandar el mismo token en header X-CSRFToken y en cookies
            if not csrf_cookie or not csrf_header or not compare_digest(csrf_cookie, csrf_header):
                raise PermissionDenied(
                    {
                        "client": f"{request.is_mobile}".lower(),
                        "dont_enforce_cookies": f"{request.dont_enforce_cookies}".lower(),
                        "code": "csrf_validation_failed",
                        "message": "CSRF token missing or invalid.",
                        "details": "A valid X-CSRFToken header is required for security purposes.",
                    }
                )

        return True
