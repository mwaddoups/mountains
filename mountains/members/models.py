from django.contrib.auth.base_user import AbstractBaseUser
from django.db import models
from authemail.models import EmailUserManager, EmailAbstractUser

# We use a custom user model

class User(EmailAbstractUser):
    # Custom fields below...
    mobile_number = models.CharField(max_length=15, blank=True)

    # Required
    objects = EmailUserManager()
