from django.urls import path
from .views import StudentProfileCreateView, StudentProfileDetailView

urlpatterns = [
    # Rutas Estudiantes
    path('student/create/', StudentProfileCreateView.as_view(), name='student-create'),
    path('student/me/', StudentProfileDetailView.as_view(), name='student-me'),
]