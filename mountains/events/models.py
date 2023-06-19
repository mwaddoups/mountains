from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Event(models.Model):
    class EventType(models.TextChoices):
        SUMMER_DAY_WALK = 'SD'
        SUMMER_WEEKEND = 'SW'
        WINTER_DAY_WALK = 'WD'
        WINTER_WEEKEND = 'WW'
        CLIMBING = 'CL'
        SOCIAL = 'SO'
        COMMITTEE = 'CM'
        OTHER = 'XX'

    title = models.CharField(max_length=100, blank=False)
    created_date = models.DateTimeField(auto_now_add=True)
    event_date = models.DateTimeField(blank=False)
    event_type = models.CharField(max_length=2, choices=EventType.choices, default=EventType.OTHER)
    description = models.TextField(blank=False)
    attendees = models.ManyToManyField(User, through='AttendingUser', blank=True)
    max_attendees = models.IntegerField(null=False, blank=False, default=0)
    organiser = models.ForeignKey(User, on_delete=models.SET_NULL, blank=False, null=True, related_name='organiser')
    show_popup = models.BooleanField(blank=False, null=False, default=False)
    members_only = models.BooleanField(blank=False, null=False, default=False)
    signup_open = models.BooleanField(blank=False, null=False, default=True)
    is_deleted = models.BooleanField(blank=False, null=False, default=False)

class AttendingUser(models.Model):
    modified_date = models.DateTimeField(auto_now=True)
    list_join_date = models.DateTimeField(auto_now_add=True) # Gets updated manually by waiting list changes
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    is_waiting_list = models.BooleanField(blank=False, null=False, default=False)
    is_trip_paid = models.BooleanField(blank=False, null=False, default=False)
