from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    ordering = ('email',)
    
    list_display = ('email', 'first_name', 'last_name', 'nationality', 'is_staff')
    
    search_fields = ('email', 'first_name', 'last_name')
    
    # 4. Formulario de EDICIÓN de usuario (cuando entras a un usuario existente)
    # Aquí quitamos 'username' y agregamos tus campos personalizados
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Información Personal', {
            'fields': (
                'first_name', 'last_name', 'middle_name', 'prefix', 
                'pronouns', 'secondary_email', 'phone_number', 
                'nationality', 'photo', 'user_type'
            )
        }),
        ('Permisos', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        ('Fechas Importantes', {'fields': ('last_login', 'date_joined')}),
    )
    
    # 5. Formulario de CREACIÓN de usuario (el botón "Add User")
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password', 'first_name', 'last_name'),
        }),
    )

# Registramos el modelo con la configuración personalizada
admin.site.register(User, CustomUserAdmin)

