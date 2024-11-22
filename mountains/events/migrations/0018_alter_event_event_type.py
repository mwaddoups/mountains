# Generated by Django 3.2.11 on 2024-10-06 16:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0017_alter_event_event_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='event_type',
            field=models.CharField(choices=[('SD', 'Summer Day Walk'), ('SW', 'Summer Weekend'), ('WD', 'Winter Day Walk'), ('WW', 'Winter Weekend'), ('CL', 'Indoor Climbing'), ('OC', 'Outdoor Climbing'), ('RN', 'Running'), ('SO', 'Social'), ('CM', 'Committee'), ('XX', 'Other')], default='XX', max_length=2),
        ),
    ]