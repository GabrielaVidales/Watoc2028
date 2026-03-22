from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from . import models, serializers

import stripe

stripe.api_key = settings.STRIPE_SECRET_KEY


class StripeCheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user if request.user.is_authenticated else None

        try:
            session = stripe.checkout.Session.create(
                mode="payment",
                customer_email=user.email,
                payment_method_types=["card"],
                submit_type="pay",
                line_items=[
                    {"price": "price_1SrqiXGh7iCsD7rtpktVqmUI", "quantity": 1},
                    {"price": "price_1TAhXHGh7iCsD7rtbwyT2D5c", "quantity": 1},
                ],
                success_url=f"{settings.DOMAIN}/payments/success?session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url=f"{settings.DOMAIN}/payments/failed?session_id={{CHECKOUT_SESSION_ID}}",
                billing_address_collection="required",
            )

            payment = models.Payment.objects.create(
                user=user,
                amount=session.amount_total / 100,
                stripe_session_id=session.id,
                currency=session.currency,
            )

            serializer = serializers.PaymentSerializer(payment)

            return Response(
                {
                    "checkout_url": session["url"],
                    "payment": serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class PaymentSuccess(APIView):
    def get(self, request):
        session_id = request.GET.get("session_id")
        try:
            session = stripe.checkout.Session.retrieve(session_id)
            if session.payment_status == "unpaid":
                return Response({"error": "Payment unpaid."}, status=status.HTTP_400_BAD_REQUEST)

            payment = models.Payment.objects.get(stripe_session_id=session.id)
            payment.amount = session.amount_total
            payment.currency = session.currency
            payment.payment_intent_id = session.payment_intent
            payment.is_paid = True
            payment.save()

            serializer = serializers.PaymentSerializer(payment)
            session_data = dict(session)
            
            return Response(
                {
                    "message": "Payment successful!",
                    "data": {
                        "payment": serializer.data,
                        "session": session_data,
                    },
                },
                status=status.HTTP_200_OK,
            )
        except stripe.error.InvalidRequestError:
            return Response({"error": "Invalid session ID."}, status=status.HTTP_400_BAD_REQUEST)
        except models.Payment.DoesNotExist:
            return Response({"error": "Payment not found."}, status=status.HTTP_404_NOT_FOUND)


class PaymentFailed(APIView):
    def get(self, request):
        session_id = request.GET.get("session_id")
        session = stripe.checkout.Session.expire(session_id)
        return Response({"message": "Payment failed!"}, status=status.HTTP_200_OK)
