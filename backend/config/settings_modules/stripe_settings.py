import os

STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

# Estos son los productos creados en Stripe, es más práctico configurarlo aquí que hardcodearlo
STRIPE_PRICE_ID_CONGRESS = os.getenv("STRIPE_PRICE_ID_CONGRESS")
STRIPE_PRICE_ID_GUEST = os.getenv("STRIPE_PRICE_ID_GUEST")
