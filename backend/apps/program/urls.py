from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"events", views.ScheduledEventViewSet, "events")
router.register(r"tags", views.TagViewSet, "tags")

urlpatterns = [] + router.urls
