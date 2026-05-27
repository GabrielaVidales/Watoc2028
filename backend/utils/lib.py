import hmac
import hashlib
from django.conf import settings

def get_password_signature(user):
        """
        Genera una firma HMAC de la contraseña actual del usuario.
        Si la contraseña cambia, la firma será diferente.
        """
        return hmac.new(
            settings.SECRET_KEY.encode(),
            user.password.encode(),
            hashlib.sha256
        ).hexdigest()
