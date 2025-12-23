from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import UserRegistrationView, UserProfileView


urlpatterns = [
    # --- Gestión de Usuarios ---
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),

    # --- Autenticación (JWT) ---
    # Login (Te da el access y refresh token)
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # Refrescar token (cuando caduca el access token)
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]