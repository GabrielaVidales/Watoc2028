from django.http import HttpRequest, HttpResponse


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
