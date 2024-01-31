import requests
from django.conf import settings
from typing import TypedDict, NewType

GUILD_ID = "920776260496523264"
MEMBER_ROLE_ID = "974275340874678283"


class DiscordUser(TypedDict):
    id: str  # called snowflake by Discord
    username: str


class DiscordMember(TypedDict):
    user: DiscordUser
    nick: str | None
    roles: list[str]


def _api_headers():
    return {
        "Authorization": f"Bot {settings.DISCORD_API_KEY}",
        "User-Agent": "DiscordBot (https://discord.com/api/v10/, 10)",
    }


def fetch_all_members() -> list[DiscordMember]:
    page_size = 1000
    members = []
    while len(members) % page_size == 0:
        res = requests.get(
            f"https://discord.com/api/v10/guilds/{GUILD_ID}/members?limit={page_size}&after={len(members)}",
            headers=_api_headers(),
        )
        members_page: list[DiscordMember] = res.json()
        members += members_page

    return members


def set_member_role(user_id: str):
    if not settings.DEBUG:
        res = requests.put(
            f"https://discord.com/api/v10/guilds/{GUILD_ID}/members/{user_id}/roles/{MEMBER_ROLE_ID}",
            headers=_api_headers(),
        )
        print(res.content)
    else:
        print(
            f"DEBUG: Not actually posting to Discord, would set user_id {user_id} to member!"
        )


def remove_member_role(user_id: str):
    if not settings.DEBUG:
        res = requests.delete(
            f"https://discord.com/api/v10/guilds/{GUILD_ID}/members/{user_id}/roles/{MEMBER_ROLE_ID}",
            headers=_api_headers(),
        )
        print(res.content)
    else:
        print(
            f"DEBUG: Not actually posting to Discord, would remove member from user_id {user_id}!"
        )


def member_username(member: DiscordMember) -> str:
    """
    Helper function to get username in form we store internally
    """

    display_name = (
        member["nick"] if member["nick"] is not None else member["user"]["username"]
    )
    return f'{display_name} ({member["user"]["username"]})'
