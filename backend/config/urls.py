from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from . import views

urlpatterns = [
    path("admin/", include("admin_honeypot.urls", namespace="admin_honeypot")),
    path("admin-watoc/", admin.site.urls),
    path("api/", include("apps.users.urls")),
    path("api/auth/", include("apps.auth.urls")),
    path("api/contact/", include("apps.contact_requests.urls")),
    path("api/abstracts/", include("apps.abstracts.urls")),
    path("api/notifications/", include("apps.notifications.urls")),
    path("api/payments/", include("apps.payments.urls")),
    path("api/reviews/", include("apps.reviews.urls")),
    
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    path("preview/", views.preview_contact_email),
]

# Esto permite a Django servir las imágenes en modo DEBUG (desarrollo)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
