from django.db import models


class MembershipPrice(models.Model):
    price_id = models.CharField(max_length=500, unique=True)
