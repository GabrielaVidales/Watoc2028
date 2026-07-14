from rest_framework.request import Request
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed


class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request: Request):
        
        # Si no hay token en las cookies, buscar por default en Authorization bearer
        header = self.get_header(request)
        if header is not None:
            return super().authenticate(request)
        
        # Intentamos obtener el token de la cookie 'access_token'
        raw_token = request.COOKIES.get("access_token")
        if raw_token is None:
            return None
        
        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token

