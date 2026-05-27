from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"abstracts", views.AbstractView, "abstracts")
router.register(r"affiliations", views.AuthorAffiliationsView, "affiliations")
router.register(r"authors", views.AuthorsView, "authors")
router.register(r"users", views.UserView, "users")
router.register(r"abstract-declarations", views.AuthorDeclarationsView, "abstract_declarations")
router.register(r"tours", views.TourView, "tours")
router.register(r"password-reset", views.PasswordResetView, "password-reset")


urlpatterns = [
    path("login/", views.CustomTokenObtainPairView.as_view(), name="login"),
    path("token/refresh/", views.CustomTokenRefreshView.as_view(), name="token_refresh"),
    path("logout/", views.LogoutView.as_view(), name="logout"),
    path("verify-email/", views.EmailVeriricationView.as_view(), name="verify-email"),
] + router.urls
