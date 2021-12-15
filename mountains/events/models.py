from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Event(models.Model):
    title = models.CharField(max_length=100, blank=False)
    created_date = models.DateTimeField(auto_now_add=True)
    event_date = models.DateTimeField(blank=False)
    description = models.TextField(blank=False)
    attendees = models.ManyToManyField(User)
    max_attendees = models.IntegerField(null=True, blank=False)
    organiser = models.ForeignKey(User, on_delete=models.SET_NULL, blank=False, null=True, related_name='organiser')
