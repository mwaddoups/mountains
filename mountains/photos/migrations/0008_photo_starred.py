# Generated by Django 3.2.11 on 2023-01-10 09:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('photos', '0007_alter_photo_photo'),
    ]

    operations = [
        migrations.AddField(
            model_name='photo',
            name='starred',
            field=models.BooleanField(default=False),
        ),
    ]