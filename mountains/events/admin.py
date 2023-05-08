from django.contrib import admin
from .models import Event

class EventAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'created_date', 'event_date', 'is_deleted')
    ordering = ('event_date', )

admin.site.register(Event, EventAdmin)
