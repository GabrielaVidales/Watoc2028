from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    # URL trampa para que los bots boteen
    path('admin/', include('admin_honeypot.urls', namespace='admin_honeypot')),
    # URL secreta, la verdadera
    path('admin-watoc/', admin.site.urls),

    path('api/', include('users.urls')),
    path('api/', include('contact_requests.urls')),
    
    path('api/payments/', include('payments.urls')),
    
    path('preview/', views.preview_contact_email)
]

# Esto permite a Django servir las imágenes en modo DEBUG (desarrollo)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
