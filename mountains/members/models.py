import os
import uuid
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from django.db import models

class UserManager(BaseUserManager):
    """
    This handles creation of a user that only has an email.
    """
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('The email must be set!')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

def get_profile_pic_filename(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'
    return os.path.join('uploads', 'profile', filename)

class User(AbstractUser):
    # We redefine email because it must be set as unique
    email = models.EmailField('email address', unique=True)
    # Other custom fields can then be added below.
    mobile_number = models.CharField(max_length=50, blank=True)
    about = models.TextField('about you', blank=True)
    profile_picture = models.ImageField(
        upload_to=get_profile_pic_filename,
        null=True,
        blank=True,
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    # Use our custom user manager
    objects = UserManager()

class Experience(models.Model):
    EXP_LEVELS = (
        (0, 'No Experience'),
        (1, 'Beginner'),
        (2, 'Second'),
        (3, 'Leader'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='experience', primary_key=True)
    hillwalking = models.IntegerField(choices=EXP_LEVELS)
    scrambling = models.IntegerField(choices=EXP_LEVELS)
    trad_climbing = models.IntegerField(choices=EXP_LEVELS)
    winter_walking = models.IntegerField(choices=EXP_LEVELS)
    winter_climbing = models.IntegerField(choices=EXP_LEVELS)
    ski_touring = models.IntegerField(choices=EXP_LEVELS)
    trail_running = models.IntegerField(choices=EXP_LEVELS)
    indoor_climbing = models.IntegerField(choices=EXP_LEVELS)
