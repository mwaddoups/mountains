# Generated by Django 3.2.11 on 2023-05-08 06:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0010_event_signup_open'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='is_deleted',
            field=models.BooleanField(default=False),
        ),
    ]
