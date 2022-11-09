# Generated by Django 3.2.11 on 2022-11-09 10:22

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('events', '0004_manual_event_attendees'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attendinguser',
            name='event',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='events.event'),
        ),
        migrations.AlterField(
            model_name='attendinguser',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='event',
            name='attendees',
            field=models.ManyToManyField(blank=True, through='events.AttendingUser', to=settings.AUTH_USER_MODEL),
        ),
    ]