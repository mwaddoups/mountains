# Generated by Django 3.2.11 on 2024-09-17 19:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0016_event_price_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='event_type',
            field=models.CharField(choices=[('SD', 'Summer Day Walk'), ('SW', 'Summer Weekend'), ('WD', 'Winter Day Walk'), ('WW', 'Winter Weekend'), ('CL', 'Indoor Climbing'), ('OC', 'Outdoor Climbing'), ('SO', 'Social'), ('CM', 'Committee'), ('XX', 'Other')], default='XX', max_length=2),
        ),
    ]