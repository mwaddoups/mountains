from django.contrib import admin
from .models import FeedPost, EventPost, Comment

class FeedPostAdmin(admin.ModelAdmin):
    list_display = ('id', 'posted', 'user', 'text')
    ordering = ('posted',)

admin.site.register(FeedPost, FeedPostAdmin)
admin.site.register(Comment)
admin.site.register(EventPost)
