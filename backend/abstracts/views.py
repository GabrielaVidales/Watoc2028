from rest_framework.viewsets import ModelViewSet
from django.contrib.auth import get_user_model
from .serializers import AffiliationSerializer
from .models import Affiliation
import logging

User = get_user_model()

logger = logging.getLogger("users")

# Create your views here.


class AffiliationViewSet(ModelViewSet):
    queryset = Affiliation.objects.all()
    serializer_class = AffiliationSerializer
