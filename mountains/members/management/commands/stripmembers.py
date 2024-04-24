import datetime
from django.core.management.base import BaseCommand, CommandParser
from members.models import User
from members.discord import remove_member_role
import time


class Command(BaseCommand):
    help = "Strips membership from Discord members for given date. Designed to be ran one-time only."

    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument("date_str", type=str, help="Date in YYYY-MM-DD form")

    def handle(self, *args, **kwargs):
        date = datetime.datetime.strptime(kwargs["date_str"], "%Y-%m-%d")

        expired_users = User.objects.filter(membership_expiry=date).order_by(
            "last_name"
        )

        print(f"Found {len(expired_users)} users who will have membership revoked!")
        for user in expired_users:
            print(f"{user.first_name} {user.last_name}")

        input("Remove role? (CTRL+C to exit)")

        for user in expired_users:
            if user.discord_id is not None:
                print(f"Removing membership from {user.first_name} {user.last_name}..")
                remove_member_role(user.discord_id)
                # Sleep in case there is an API limit (haven't checked)
                # There was an issue here so raised sleep from 0.5 to 2.0
                time.sleep(2.0)
