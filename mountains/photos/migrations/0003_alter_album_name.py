# Generated by Django 3.2.11 on 2022-02-24 11:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('photos', '0002_auto_20220224_1046'),
    ]

    operations = [
        migrations.AlterField(
            model_name='album',
            name='name',
            field=models.CharField(max_length=200),
        ),
    ]
