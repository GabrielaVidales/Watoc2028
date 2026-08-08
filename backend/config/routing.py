from apps.notifications.routing import websocket_urlpatterns as notification_patterns
from apps.abstracts.routing import websocket_urlpatterns as abstract_patterns

websocket_urlpatterns = [
    *notification_patterns,
    *abstract_patterns,
]
