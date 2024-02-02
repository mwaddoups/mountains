from django.core.management.base import BaseCommand
from members.models import User
from members.discord import fetch_all_members, DiscordMember, member_username


class Command(BaseCommand):
    help = "Updates users with their matched discord users. Designed to be ran one-time only."

    def handle(self, *args, **kwargs):
        users = list(User.objects.all())
        members = fetch_all_members()

        matches = {}
        total = 0
        for member in members:
            display_name = (
                member["nick"]
                if member["nick"] is not None
                else member["user"]["username"]
            )
            user = match_user_to_member(users, display_name, kind="strong")
            if user is not None:
                matches[display_name] = (user, member)
                users.remove(user)

        for member in members:
            display_name = (
                member["nick"]
                if member["nick"] is not None
                else member["user"]["username"]
            )
            if display_name not in matches:
                user = match_user_to_member(users, display_name, kind="reasonable")
                if user is not None:
                    matches[display_name] = (user, member)
                    users.remove(user)

        for member in members:
            display_name = (
                member["nick"]
                if member["nick"] is not None
                else member["user"]["username"]
            )
            if display_name not in matches:
                user = match_user_to_member(users, display_name, kind="weak")
                if user is not None:
                    matches[display_name] = (user, member)

        for display_name, (user, member) in matches.items():
            print(display_name, "|", user.first_name, user.last_name)
            user.discord_id = member["user"]["id"]
            user.save()

        print("Matched and updated", len(matches), "/", len(members))


def match_user_to_member(
    users: list[User], display_name: str, kind: str
) -> User | None:
    possible_members = []
    dn = display_name.lower().strip("0123456789_.")
    if kind == "strong":
        for user in users:
            fn = user.first_name.lower()
            ln = user.last_name.lower()
            if len(fn) > 1 and len(ln) > 1:
                if fn == dn[: len(fn)] and ln == dn[-len(ln) :]:
                    # They are an easy match - starts with first name, ends with last name
                    possible_members.append(user)

    elif kind == "reasonable":
        # Attempt some reasonable things
        for user in users:
            fn = user.first_name.lower()
            ln = user.last_name.lower()
            if len(fn) > 1 and len(ln) > 1:
                if fn[0] == dn[0] and ln == dn[-len(ln) :]:
                    # begins with first initial, ends with last name
                    possible_members.append(user)
                elif (fn == dn[: len(fn)]) and (ln[0] == dn[-1]):
                    # begins with first name, ends with last initial
                    possible_members.append(user)

    elif kind == "weak":
        # We try some last-ditch stuff
        for user in users:
            fn = user.first_name.lower()
            ln = user.last_name.lower()
            if len(fn) > 1 and len(ln) > 1:
                if fn[:3] in dn and ln[:3] in dn:
                    possible_members.append(user)

    if len(possible_members) == 1:
        return possible_members[0]
    elif len(possible_members) > 1:
        print(f"----{kind}----")
        print(dn)
        for m in possible_members[:5]:
            print("\t", m.first_name, m.last_name)
        return None
    else:
        return None
