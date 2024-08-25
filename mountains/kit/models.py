from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Kit(models.Model):
    text_id = models.CharField(max_length=50, null=True)
    description = models.CharField(max_length=500, null=True)
    brand = models.CharField(max_length=100, null=True)
    color = models.CharField(max_length=50, null=True)
    type = models.CharField(max_length=50, null=True)
    purchased_on = models.DateField(null=True)
    seller = models.CharField(max_length=100, null=True)
    price = models.FloatField(null=True)
    last_checked = models.DateField(null=True)
    last_condition = models.CharField(max_length=50, null=True)
    notes = models.TextField(blank=True, null=True)


class KitBorrow(models.Model):
    kit = models.ForeignKey(Kit, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    request_date = models.DateTimeField(auto_now_add=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    collection_details = models.TextField(default="")
    is_approved = models.BooleanField(default=False)
