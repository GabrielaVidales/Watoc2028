from django.conf import settings
from redis import Redis
from redis.exceptions import RedisError
import logging

logger = logging.getLogger(__name__)


def is_redis_available():
    try:
        client = Redis.from_url(
            settings.CELERY_BROKER_URL,
            socket_connect_timeout=0.5,
            socket_timeout=0.5,
        )
        return client.ping()

    except RedisError:
        return False
