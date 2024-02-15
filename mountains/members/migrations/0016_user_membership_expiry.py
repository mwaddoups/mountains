# CUSTOM MIGRATION - Mark wrote this

from django.db import migrations, models
from datetime import date


def set_membership_end_date(apps, schema_editor):
    User = apps.get_model("members", "User")
    for user in User.objects.all():
        if user.is_paid:
            user.membership_expiry = date(2024, 3, 31)
        user.save()


class Migration(migrations.Migration):

    dependencies = [
        ("members", "0015_alter_user_discord_id"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="membership_expiry",
            field=models.DateField(blank=True, default=None, null=True),
        ),
        migrations.RunPython(set_membership_end_date),
    ]
