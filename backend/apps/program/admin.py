from django.contrib import admin
from .models import ScheduledEvent, Trip, Tag

admin.site.register(ScheduledEvent)
admin.site.register(Tag)
admin.site.register(Trip)
