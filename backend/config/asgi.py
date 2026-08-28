from channels.auth import AuthMiddlewareStack
from channels.sessions import CookieMiddleware
from config.middleware import JWTWebsocketMiddleware
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from config.routing import websocket_urlpatterns
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": CookieMiddleware(
        JWTWebsocketMiddleware(
            URLRouter(
                websocket_urlpatterns # Tráfico de WebSockets
    ))),
})