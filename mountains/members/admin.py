from django.contrib import admin
from django.contrib.auth import get_user_model
from authemail.admin import EmailUserAdmin
from .models import Event

class UserAdmin(EmailUserAdmin):
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Information', {'fields': ('first_name', 'last_name', 'mobile_number')}),
        ('Permissions', {'fields': (
            'is_active',
            'is_staff',
            'is_superuser',
            'is_verified',
            'groups',
            'user_permissions',
        )}),
        ('Relevant Dates', {'fields': ('last_login', 'date_joined')}),
    )

admin.site.unregister(get_user_model())
admin.site.register(get_user_model(), UserAdmin)

admin.site.register(Event)