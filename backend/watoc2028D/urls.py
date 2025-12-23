"""
URL configuration for watoc2028D project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    # URL trampa para que los bots
    path('admin/', include('admin_honeypot.urls', namespace='admin_honeypot')),
    # URL secreta, la verdadera
    path('admin-Watoc-SC/', admin.site.urls),

    path('api/', include('users.urls')),
    path('api/', include('payment.urls')),
    path('api/', include('abstract.urls')),
    path('api/', include('contact_requests.urls')),
    path('api/', include('participants.urls')),
    path('api/', include('payment.urls')),
    path('api/', include('students.urls')),
    path('api/', include('visas.urls')),
]

# Esto permite a Django servir las imágenes en modo DEBUG (desarrollo)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
