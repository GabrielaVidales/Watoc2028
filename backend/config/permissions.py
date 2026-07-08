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
            csrf_header = request.headers.get('X-Csrftoken')
            csrf_cookie = request.COOKIES.get('csrftoken')
            
            if not csrf_cookie or not csrf_header or not compare_digest(csrf_cookie, csrf_header):
                raise PermissionDenied(
                    {
                        "code": "csrf_validation_failed",
                        "message": "CSRF token missing or invalid.",
                        "details": "A valid X-CSRFToken header is required for security purposes.",
                    }
                )

        return True

