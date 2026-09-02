from django.urls import path
from .views import StripeCheckoutView, StripeWebhookView, GetPaymentDetail  # , PaymentFailed, PaymentSuccess

urlpatterns = [
    path("create-checkout-session/", StripeCheckoutView.as_view(), name="create_checkout_session"),
    path("webhook/", StripeWebhookView.as_view(), name="webhook"),
    path("<str:payment_id>/", GetPaymentDetail.as_view(), name="get_payment_detail"),
    # path("success/", PaymentSuccess.as_view(), name="payment_success"),
    # path("failed/", PaymentFailed.as_view(), name="payment_failed"),
]
