from django.core.management.base import BaseCommand, CommandError
from members.models import User
from asgiref.sync import sync_to_async
import discord


class Command(BaseCommand):
    help = "Updates users with their matched discord users"

    def handle(self, *args, **kwargs):
        intents = discord.Intents.default()
        intents.members = True
        client = discord.Client(intents=intents)

        users = list(User.objects.all())
        existing_names = set(u.discord_username for u in users)

        @sync_to_async
        def save_user(user):
            user.save()

        @client.event
        async def on_ready():
            print(f"We have logged in as {client.user}")
            matches = 0
            total = 0
            for member in client.get_all_members():
                if member.name not in existing_names:
                    user = match_user_to_member(users, member)
                    total += 1
                    if user is None:
                        print(member.display_name, "| no match")
                    else:
                        print(member.display_name, "|", user.first_name, user.last_name)
                        matches += 1
                        user.discord_username = member.name
                        await save_user(user)

            print("Matched and updated", matches, "/", total)

            await client.close()

        client.run(
            "MTE5NDQxNTQ5Mjc3ODE4MDY0OA.GChz6y.DT0ymE7dJCtKH46nxushWR4qp_pczZk_e6oNqs"
        )


def match_user_to_member(users: list[User], member: discord.Member):
    possible_members = []
    dn = member.display_name.lower().strip("0123456789_")
    for user in users:
        fn = user.first_name.lower()
        ln = user.last_name.lower()
        if len(fn) > 1 and len(ln) > 1 and user.discord_username is None:
            if (fn == dn[: len(fn)]) and (ln == dn[-len(ln) :]):
                possible_members.append(user)
            elif (fn + ln) == dn:
                possible_members.append(user)
            elif (fn + " " + ln) == dn:
                possible_members.append(user)
            elif (fn[0] + ln) == dn:
                possible_members.append(user)
            elif (fn[0] + " " + ln) == dn:
                possible_members.append(user)
            elif (fn + ln[0]) == dn:
                possible_members.append(user)
            elif (fn + " " + ln[0]) == dn:
                possible_members.append(user)

    if len(possible_members) == 1:
        return possible_members[0]
    elif len(possible_members) > 1:
        print("-------")
        print(dn)
        for m in possible_members[:5]:
            print("\t", m.first_name, m.last_name)
        return None
    else:
        return None
