from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'is_staff', 'is_superuser', 'is_approved')
    fieldsets = (
        (None, {'fields': ('email', 'password', 'profile_picture')}),
        ('Personal Information', {'fields': ('first_name', 'last_name', 'mobile_number')}),
        ('Permissions', {'fields': (
            'is_approved',
            'is_active',
            'is_staff',
            'is_superuser',
            'groups',
            'user_permissions',
        )}),
        ('Relevant Dates', {'fields': ('last_login', 'date_joined')}),
    )

    search_fields = ('email',)
    ordering = ('email',)
    filter_horizontal = ()

admin.site.register(User, CustomUserAdmin)