from django.urls import path
from .views import UserRegistrationView, UserProfileView, CustomTokenObtainPairView, CustomTokenRefreshView, LogoutView, ChangePasswordView, RequestResetCodeView,VerifyCodeView,SetNewPasswordView

urlpatterns = [
    # --- Gestión de Usuarios ---
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('profile/change-password/',ChangePasswordView.as_view(), name = "profile_change_password"),

    # endpoinds para la recuperación de contraseña
    path('request-reset-code/',RequestResetCodeView.as_view(), name = "profile_change_password"),
    path('verify-code/',VerifyCodeView.as_view(), name = "profile_change_password"),
    path('set-new-password/',SetNewPasswordView.as_view(), name = "profile_change_password"),
    # path('verification-password/',VerificationPasswordView.as_view(), name= "verification_password"),

    # --- Autenticación (JWT) ---
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
]