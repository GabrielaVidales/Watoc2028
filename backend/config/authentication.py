from rest_framework.request import Request
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.http.request import HttpRequest


class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request: Request):
        # Si no hay token en las cookies, buscar por default en Authorization bearer
        if  request.dont_enforce_cookies and request.has_access_token:
            # El Access Token viene desde el middleware config.AccessTokenMiddleware
            validated_token = self.get_validated_token(request.access_token)
            return self.get_user(validated_token), validated_token        
        
        # Si es mobile aquí se detiene
        if request.is_mobile:
            print('Mobile no autenticado')
            return None
        
        # Intentamos obtener el token de la cookie 'access_token'
        raw_token = request.COOKIES.get("access_token")
        if raw_token is None:
            return None
        
        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token
