from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Kit(models.Model):
    text_id = models.CharField(max_length=50)
    description = models.CharField(max_length=500)
    brand = models.CharField(max_length=100)
    color = models.CharField(max_length=50)
    type = models.CharField(max_length=50)
    purchased_on = models.DateField()
    added_on = models.DateTimeField(auto_now_add=True)
    seller = models.CharField(max_length=100)
    price = models.FloatField()
    last_checked = models.DateField()
    last_condition = models.CharField(max_length=50)
    notes = models.TextField(blank=True, null=True)


class KitBorrow(models.Model):
    kit = models.ForeignKey(Kit, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
