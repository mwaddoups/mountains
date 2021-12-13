from django.contrib import admin
from .models import FeedPost, EventPost, Comment

admin.site.register(FeedPost)
admin.site.register(Comment)
admin.site.register(EventPost)
