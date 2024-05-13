from django.db.models.signals import pre_save
from django.dispatch import receiver
from events.models import AttendingUser
from activity.models import Activity

# No signals in here! Was previously used for activity logging, but no access to user...
