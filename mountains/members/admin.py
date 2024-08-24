from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Experience, User


class CustomUserAdmin(UserAdmin):
    list_display = (
        "email",
        "is_staff",
        "is_superuser",
        "is_approved",
        "is_committee",
        "is_walk_coordinator",
        "is_dormant",
        "last_login",
    )
    fieldsets = (
        (None, {"fields": ("email", "password", "profile_picture")}),
        (
            "Personal Information",
            {"fields": ("first_name", "last_name", "mobile_number")},
        ),
        ("Committee Information", {"fields": ("committee_role", "committee_bio")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_approved",
                    "is_committee",
                    "is_walk_coordinator",
                    "is_active",
                    "is_dormant",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Relevant Dates", {"fields": ("last_login", "date_joined")}),
    )

    search_fields = ("email",)
    ordering = ("email",)
    filter_horizontal = ()


class ExperienceAdmin(admin.ModelAdmin):
    list_display = ("user", "activity", "competency")
    ordering = ("user",)


admin.site.register(User, CustomUserAdmin)
admin.site.register(Experience, ExperienceAdmin)
