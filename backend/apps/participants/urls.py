from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"profiles", views.ParticipantView, "profiles")
router.register(r"tours", views.TourView, "tours")

urlpatterns = [] + router.urls
