from rest_framework.throttling import AnonRateThrottle

# Creamos una clase nueva
class DailyAnonThrottle(AnonRateThrottle):
    # AQUÍ es donde definimos el nombre que usaremos en settings
    scope = 'anon_daily'