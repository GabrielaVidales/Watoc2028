from django.contrib import admin
from .models import User, Participant, Dinner, Abstract, Author, AuthorAffiliation

admin.site.register(User)
admin.site.register(Participant)
admin.site.register(Dinner)
admin.site.register(Abstract)
admin.site.register(AuthorAffiliation)
admin.site.register(Author)

