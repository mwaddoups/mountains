# Generated by Django 3.2.11 on 2022-11-09 10:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0005_auto_20221109_1022'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='max_attendees',
            field=models.IntegerField(default=0),
        ),
    ]
