from django.http import HttpRequest, HttpResponse
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model


class ClientOriginMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        # Este header es propio, se inyecta en las peticiones de la app mobile
        client_origin = request.META.get("HTTP_X_CLIENT_ORIGIN")

        # El header debe tener como valor "mobile"
        is_mobile_client = client_origin == "mobile"

        # Se inyectan estos atributos en TODOS los requests
        # (para que funcione, debe registrarse en settings.py)
        request.is_mobile = is_mobile_client
        request.dont_enforce_cookies = is_mobile_client

        # Siguiente middleware...
        response: HttpResponse = self.get_response(request)
        return response


class AccessTokenMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        # Por defecto se pone esto en False
        request.has_refresh_token = False

        # Buscar una cookie refresh_token
        cookie = request.COOKIES.get("refresh_token")

        # Se inyectan estos atributos en la requests
        if cookie:
            request.refresh_token = cookie
            request.has_refresh_token = True

        # Por defecto se pone esto en False
        request.has_access_token = False

        # Solo si es mobile se revisa este tipo de auth
        if request.is_mobile:
            # En este header viene el token de autenticación
            authorization_header = request.headers.get("Authorization", "")
            # Se inyectan estos atributos en la requests
            if authorization_header.startswith("Bearer "):
                # Se obtiene solo la parte del token
                token = authorization_header.split(" ", 1)[1].strip()
                request.access_token = token
                request.has_access_token = True

        # Siguiente middleware...
        response: HttpResponse = self.get_response(request)
        return response


@database_sync_to_async
def get_user_from_token(token):
    try:
        access_token = AccessToken(token)
        User = get_user_model()
        instance = User.objects.get(id=access_token["user_id"])
        return instance
    except Exception:
        return None


class JWTWebsocketMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        """
        Este Middleware obtiene las Cookies desde el websocket
        (asegurarse de que la URL del frontend apunte al MISMO dominio
        que las cookies del backend, tal como está en DevTools) y usa
        el access token para autenticar por websocket al usuario
        """

        headers = dict(scope["headers"])
        cookie_header = headers.get(b"cookie", b"").decode()

        cookies = {}
        for cookie in cookie_header.split(";"):
            if "=" in cookie:
                key, value = cookie.strip().split("=", 1)
                cookies[key] = value

        access_token = cookies.get("access_token", None)
        scope["user"] = await get_user_from_token(access_token) if access_token is not None else None

        return await self.app(scope, receive, send)
