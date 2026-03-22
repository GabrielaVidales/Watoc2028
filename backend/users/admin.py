from django.contrib import admin
from . import models

admin.site.register(models.User)
admin.site.register(models.Participant)
admin.site.register(models.Dinner)
admin.site.register(models.Abstract)
admin.site.register(models.AuthorAffiliation)
admin.site.register(models.Author)
admin.site.register(models.AbstractDeclarations)
admin.site.register(models.Tour)

