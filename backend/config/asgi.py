import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

django_asgi_app = get_asgi_application()

from channels.sessions import CookieMiddleware
from channels.routing import ProtocolTypeRouter, URLRouter
from config.middleware import JWTWebsocketMiddleware
from config.routing import websocket_urlpatterns

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": CookieMiddleware(
        JWTWebsocketMiddleware(
            URLRouter(
                websocket_urlpatterns
            )
        )
    ),
})