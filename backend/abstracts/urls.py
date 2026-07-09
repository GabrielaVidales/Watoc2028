from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"submissions", views.AbstractView, "abstracts")
router.register(r"authors", views.AuthorsView, "authors")
router.register(r"affiliations", views.AffiliationViewSet, "affiliations")
router.register(r"declarations", views.AuthorDeclarationsView, "abstract_declarations")

urlpatterns = [] + router.urls
