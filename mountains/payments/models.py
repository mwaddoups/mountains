from django.db import models
from datetime import date


class MembershipPrice(models.Model):
    price_id = models.CharField(max_length=500, unique=True)
    expiry_date = models.DateField(null=False, blank=False, default=date(2024, 3, 31))
