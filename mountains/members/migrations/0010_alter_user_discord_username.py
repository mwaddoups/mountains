# Generated by Django 3.2.11 on 2024-01-29 19:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('members', '0009_user_discord_username'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='discord_username',
            field=models.CharField(default=None, max_length=100, null=True),
        ),
    ]