# Generated by Django 3.2.11 on 2023-09-18 13:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0014_auto_20230619_1037'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='signup_open_date',
            field=models.BooleanField(blank=True, default=None, null=True),
        ),
    ]
