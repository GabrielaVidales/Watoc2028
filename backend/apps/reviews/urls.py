from rest_framework.routers import DefaultRouter
from django.urls import path
from . import views

router = DefaultRouter()
router.register(r"assignments", views.ReviewAssignmentViewSet, "assignments")
router.register(r"review", views.ReviewViewSet, "review")

urlpatterns = [
    path('users/', views.ReviewerViewSet.as_view(), name='users-list')
] + router.urls
