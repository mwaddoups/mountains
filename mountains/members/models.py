from django.contrib.auth.base_user import AbstractBaseUser
from django.db import models
from authemail.models import EmailUserManager, EmailAbstractUser

# We use a custom user model
class User(EmailAbstractUser):
    # Custom fields below...
    mobile_number = models.CharField(max_length=50, blank=True)

    # Required
    objects = EmailUserManager()

class Event(models.Model):
    title = models.CharField(max_length=100, blank=False)
    created_date = models.DateTimeField(auto_now_add=True)
    event_date = models.DateTimeField(blank=False)
    description = models.TextField(blank=False)
    attendees = models.ManyToManyField(User)
    max_attendees = models.IntegerField(null=True, blank=False)
