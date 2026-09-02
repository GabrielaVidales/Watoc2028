from django.conf import settings
from typing import Literal

import stripe

stripe.api_key = settings.STRIPE_SECRET_KEY

client = stripe.StripeClient(settings.STRIPE_SECRET_KEY)
endpoint_secret = settings.STRIPE_WEBHOOK_SECRET


VALID_ITEMS = {
    "congress": settings.STRIPE_PRICE_ID_CONGRESS,
    "guest": settings.STRIPE_PRICE_ID_GUEST,
}

ValidKeys = Literal["congress", "guest"]


def get_item_data(key: list[ValidKeys]):
    return [
        {
            "price": VALID_ITEMS[data],
            "quantity": 1,
        }
        for data in key
    ]


def create_checkout_session(item_data, customer_email, metadata):
    cancel_url = f"{settings.DOMAIN}/payments/failed?session_id={{CHECKOUT_SESSION_ID}}"
    success_url = f"{settings.DOMAIN}/payments/success?session_id={{CHECKOUT_SESSION_ID}}"

    return stripe.checkout.Session.create(
        mode="payment",
        submit_type="pay",
        payment_method_types=["card"],
        line_items=item_data,
        cancel_url=cancel_url,
        success_url=success_url,
        customer_email=customer_email,
        billing_address_collection="required",
        metadata=metadata,
    )


def get_payment_details(payment):
    session = stripe.checkout.Session.retrieve(
        payment.stripe_session_id,
    )

    line_items = stripe.checkout.Session.list_line_items(
        payment.stripe_session_id,
    )

    items = []
    for item in line_items.data:
        items.append(
            {
                "id": item.id,
                "name": item.description,
                "description": item.description,
                "price_id": item.price.id,
                "product_id": item.price.product,
                "quantity": item.quantity,
                "unit_amount": item.price.unit_amount,
                "subtotal": item.amount_subtotal,
                "discount": item.amount_discount,
                "tax": item.amount_tax,
                "total": item.amount_total,
                "currency": item.currency,
            }
        )

    totals = {
        "subtotal": session.amount_subtotal,
        "discount": session.total_details.amount_discount,
        "tax": session.total_details.amount_tax,
        "shipping": session.total_details.amount_shipping,
        "total": session.amount_total,
        "currency": session.currency,
    }

    session_data = {
        "id": session.id,
        "status": session.status,
        "payment_status": session.payment_status,
        "currency": session.currency,
        "created_at": session.created,
    }

    return {
        "id": payment.id,
        "status": payment.status,
        "created_at": int(payment.created_at.timestamp() * 1000),
        "session_data": session_data,
        "items": items,
        "totals": totals,
    }


def get_webhook_event(request):
    payload = request.body
    sig_header = request.headers.get("Stripe-Signature")

    if endpoint_secret:
        return client.construct_event(
            payload,
            sig_header,
            endpoint_secret,
        )

    raise ValueError()
