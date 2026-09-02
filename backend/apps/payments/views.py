from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from . import models, serializers, services
from django.db.models import Q
import stripe


class StripeWebhookView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        event = None
        try:
            event = services.get_webhook_event(request)
        except stripe.error.SignatureVerificationError as e:
            return Response(
                {"error": "Invalid signature."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except ValueError:
            return Response(
                {"error": "No endpoint secret"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if models.StripeWebhookEvent.objects.filter(id=event.id).exists():
            return Response({"error": "Invalid operation."})

        models.StripeWebhookEvent.objects.create(id=event.id)

        if event.type == "checkout.session.completed":
            session = event.data.object
            payment_id = session.metadata.get("payment_id")

            try:
                payment = models.Payment.objects.get(id=payment_id)
            except models.Payment.DoesNotExist:
                return Response(
                    {"error": "Payment not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            payment.stripe_session_id = session.id
            payment.payment_intent_id = session.payment_intent
            payment.status = models.PaymentStatus.PAID
            payment.save(
                update_fields=[
                    "stripe_session_id",
                    "payment_intent_id",
                    "status",
                ]
            )

        else:
            print("Unhandled event type {}".format(event.type))

        return Response(
            {"success": True},
            status=status.HTTP_200_OK,
        )


class StripeCheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        idempotency_key = request.headers.get("Idempotency-Key")

        if models.StripeWebhookEvent.objects.filter(id=idempotency_key).exists():
            return Response({"error": "Invalid operation."})

        models.StripeWebhookEvent.objects.create(id=idempotency_key)

        user = request.user if request.user.is_authenticated else None
        email = user.email if user else None

        try:
            item_keys = request.data.get("line_items", [])
            item_data = services.get_item_data(item_keys)
        except KeyError:
            return Response(
                {
                    "errors": {
                        "line_items": ["Invalid item choice"],
                    }
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            payment = models.Payment.objects.create(
                user=user,
                status=models.PaymentStatus.PENDING,
            )

            session = services.create_checkout_session(
                item_data,
                email,
                metadata={
                    "description": "Session generated in Django API",
                    "payment_id": payment.id,
                },
            )

            payment.stripe_session_id = session.id
            payment.save(
                update_fields=[
                    "stripe_session_id",
                ]
            )

            serializer = serializers.PaymentSerializer(payment)

            return Response(
                {
                    "checkout_url": session["url"],
                    "payment": serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class GetPaymentDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, payment_id):
        idempotency_key = request.headers.get("Idempotency-Key")
        
        if models.StripeWebhookEvent.objects.filter(id=idempotency_key).exists():
            return Response({"error": "Invalid operation."}, status=status.HTTP_400_BAD_REQUEST)

        models.StripeWebhookEvent.objects.create(id=idempotency_key)

        try:
            query = Q(stripe_session_id=payment_id) #& Q(user=request.user)
            payment = models.Payment.objects.get(query)
        except models.Payment.DoesNotExist:
            return Response(
                {"error": "Payment not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        data = services.get_payment_details(payment)

        return Response(data)
