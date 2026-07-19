from django.urls import path
from .views import StripeCheckoutView, PaymentFailed, PaymentSuccess

urlpatterns = [
    path("create-checkout-session/", StripeCheckoutView.as_view(), name="create_checkout_session"),
    path("success/", PaymentSuccess.as_view(), name="payment_success"),
    path("failed/", PaymentFailed.as_view(), name="payment_failed"),
]