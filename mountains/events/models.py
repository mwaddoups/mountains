from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Event(models.Model):
    title = models.CharField(max_length=100, blank=False)
    created_date = models.DateTimeField(auto_now_add=True)
    event_date = models.DateTimeField(blank=False)
    description = models.TextField(blank=False)
    attendees = models.ManyToManyField(User, through='AttendingUser', blank=True)
    max_attendees = models.IntegerField(null=True, blank=False)
    organiser = models.ForeignKey(User, on_delete=models.SET_NULL, blank=False, null=True, related_name='organiser')
    show_popup = models.BooleanField(blank=False, null=False, default=False)

class AttendingUser(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    is_waiting_list = models.BooleanField(blank=False, null=False, default=False)
