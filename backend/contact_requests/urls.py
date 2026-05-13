from django.urls import path
from .views import ContactRequestListCreateView, test_celery

urlpatterns = [
    path('contact/', ContactRequestListCreateView.as_view(), name='contact_request'),
    path('celery/', test_celery, name='celery_test'),
]