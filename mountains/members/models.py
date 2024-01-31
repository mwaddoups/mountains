import os
import uuid
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from django.db import models
from django_resized import ResizedImageField


class UserManager(BaseUserManager):
    """
    This handles creation of a user that only has an email.
    """

    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("The email must be set!")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


def get_profile_pic_filename(instance, filename):
    ext = filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return os.path.join("uploads", "profile", filename)


class User(AbstractUser):
    id: int  # Meeded for typing
    username = None
    # We redefine email because it must be set as unique
    email = models.EmailField("email address", unique=True)
    # Other custom fields can then be added below.
    mobile_number = models.CharField(max_length=50, blank=True)
    about = models.TextField("about you", blank=True)
    profile_picture = ResizedImageField(
        size=[320, 320],
        crop=["middle", "center"],
        quality=90,
        upload_to=get_profile_pic_filename,
        null=True,
        blank=True,
    )
    is_approved = models.BooleanField(default=False)
    is_committee = models.BooleanField(default=False)
    is_walk_coordinator = models.BooleanField(default=False)
    in_case_emergency = models.TextField("emergency", blank=True)
    is_paid = models.BooleanField(default=False)
    is_on_discord = models.BooleanField(default=False)
    is_winter_skills = models.BooleanField(default=False)
    discord_username = models.CharField(max_length=100, null=True, default=None)
    discord_id = models.CharField(max_length=100, null=True, default=None)

    COMMITTEE_ROLES = [
        ("Chair", "Chair"),
        ("Vice-Chair", "Vice-Chair"),
        ("Secretary", "Secretary"),
        ("Treasurer", "Treasurer"),
        ("General", "General"),
        (None, "No role"),
    ]
    committee_role = models.TextField(
        "committee role", choices=COMMITTEE_ROLES, blank=True
    )
    committee_bio = models.TextField("commitee bio", blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    # Use our custom user manager
    objects = UserManager()


class Experience(models.Model):
    # Update these lists on the frontend too!
    EXP_LEVELS = (
        (0, "No Experience"),
        (1, "Beginner"),
        (2, "Competent"),
        (3, "Experienced"),
    )
    ACTIVITIES = (
        ("HW", "Hillwalking"),
        ("WW", "Winter Walking"),
        ("SC", "Scrambling"),
        ("IC", "Indoor Climbing"),
        ("IB", "Indoor Bouldering"),
        ("OS", "Sport Climbing"),
        ("OT", "Trad Climbing"),
        ("WC", "Winter Climbing"),
        ("ST", "Ski Touring"),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="experience")
    activity = models.TextField(choices=ACTIVITIES)
    competency = models.IntegerField(
        choices=EXP_LEVELS, null=False, blank=True, default=0
    )
    info = models.TextField(null=True, blank=True)

    class Meta:
        unique_together = ("user", "activity")
