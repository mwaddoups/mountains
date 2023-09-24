from django.db import models

# Create your models here.

class Report(models.Model):
    title = models.CharField(max_length=100, blank=False)
    report_date = models.DateTimeField(auto_now_add=True)
    content = models.TextField(blank=False)
    header_image = models.TextField(blank=True, null=True)