from django.db import models
from django.db.models.fields.related import ForeignKey
from members.models import User, Event

class FeedPost(models.Model):
    user_id = ForeignKey(User, on_delete=models.SET_NULL, blank=False, null=True)
    posted = models.DateTimeField(auto_now_add=True)
    text = models.TextField(blank=False)

class EventPost(FeedPost):
    event_id = ForeignKey(Event, on_delete=models.CASCADE)

class Comment(models.Model):
    post_id = ForeignKey(FeedPost, on_delete=models.CASCADE, related_name='comments')
    user_id = ForeignKey(User, on_delete=models.SET_NULL, blank=False, null=True)
    posted = models.DateTimeField(auto_now_add=True)
    text = models.TextField(blank=False)