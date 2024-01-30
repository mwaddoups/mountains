from django.db import models
from members.models import User


class Event(models.Model):
    class EventType(models.TextChoices):
        SUMMER_DAY_WALK = "SD"
        SUMMER_WEEKEND = "SW"
        WINTER_DAY_WALK = "WD"
        WINTER_WEEKEND = "WW"
        CLIMBING = "CL"
        SOCIAL = "SO"
        COMMITTEE = "CM"
        OTHER = "XX"

    id: int
    title = models.CharField(max_length=100, blank=False)
    created_date = models.DateTimeField(auto_now_add=True)
    event_date = models.DateTimeField(blank=False)
    event_type = models.CharField(
        max_length=2, choices=EventType.choices, default=EventType.OTHER
    )
    description = models.TextField(blank=False)
    attendees = models.ManyToManyField(User, through="AttendingUser", blank=True)
    max_attendees = models.IntegerField(null=False, blank=False, default=0)
    organiser = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=False,
        null=True,
        related_name="organiser",
    )
    show_popup = models.BooleanField(blank=False, null=False, default=False)
    members_only = models.BooleanField(blank=False, null=False, default=False)
    signup_open = models.BooleanField(blank=False, null=False, default=True)
    signup_open_date = models.DateTimeField(blank=True, null=True, default=None)
    is_deleted = models.BooleanField(blank=False, null=False, default=False)
    price_id = models.CharField(max_length=200, blank=True, null=True, default=None)

    def is_full(self) -> bool:
        """
        Checks if the event is full (0 is interpreted as no limit)
        """
        num_attendees = self.attendees.filter(
            attendinguser__is_waiting_list=False
        ).count()
        return self.max_attendees != 0 and num_attendees >= self.max_attendees

    def has_waiting_list(self) -> bool:
        """
        Returns true if either the event is full, or it already has a waiting list
        """
        waiting_list_size = self.attendees.filter(
            attendinguser__is_waiting_list=True
        ).count()
        return self.is_full() or waiting_list_size > 0


class AttendingUser(models.Model):
    modified_date = models.DateTimeField(auto_now=True)
    list_join_date = models.DateTimeField(
        auto_now_add=True
    )  # Gets updated manually by waiting list changes
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    is_waiting_list = models.BooleanField(blank=False, null=False, default=False)
    is_trip_paid = models.BooleanField(blank=False, null=False, default=False)
