from django.contrib import admin
from . import models

admin.site.register(models.Participant)
admin.site.register(models.Dinner)
admin.site.register(models.Tour)

