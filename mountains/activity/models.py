from django.db import models
from django.db.models.fields.related import ForeignKey
from members.models import User
from events.models import Event

class Activity(models.Model):
    user = ForeignKey(User, on_delete=models.SET_NULL, blank=False, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    action = models.CharField(max_length=200, blank=False)
    event = ForeignKey(Event, on_delete=models.SET_NULL, blank=True, null=True)