from django.contrib import admin
from .models import ScheduledEvent, Trip

admin.site.register(ScheduledEvent)
admin.site.register(Trip)
