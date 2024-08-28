import datetime

from django.db.models import Q
from django.db.models.aggregates import Max
from django.utils import timezone
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .discord import (
    fetch_all_members,
    get_member,
    is_member_role,
    member_username,
    remove_member_role,
    set_member_role,
)
from .models import Experience, User
from .permissions import IsCommittee, IsWalkCo, ReadOnly
from .serializers import (
    CommitteeSerializer,
    ExperienceSerializer,
    FullUserSerializer,
    ProfilePictureSerializer,
    SmallUserSerializer,
    SmallUserSerializerCommittee,
    UserSerializer,
)


class IsUserOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, user_obj):
        return user_obj.id == request.user.id


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [
        permissions.IsAdminUser
        | (permissions.IsAuthenticated & (IsUserOwner | ReadOnly))
    ]

    def create(self, request):
        # This is needed for security
        response = {"message": "User creation not allowed on this path."}
        return Response(response, status=status.HTTP_403_FORBIDDEN)

    def list(self, request):
        queryset = User.objects.filter(is_dormant=False)
        serializer = self.serializer_class(
            queryset, many=True, context={"request": request}
        )
        return Response(serializer.data)

    def get_serializer_class(self):
        if not isinstance(self.request.user, User):
            # This should never happen because of permissions
            return SmallUserSerializer

        if self.action == "list":
            if self.request.user.is_site_admin:
                return SmallUserSerializerCommittee
            else:
                return SmallUserSerializer
        else:
            # In detail view, we get .get_object()
            if (
                self.request.user.is_site_admin
                or self.request.user.id == self.get_object().id
            ):
                return FullUserSerializer
            else:
                return UserSerializer

    @action(methods=["post", "delete"], detail=True, permission_classes=[IsCommittee])
    def membership(self, request, pk=None):
        """
        We need a separate method for this to enforce committee permissions, and to set Discord
        """
        if request.method == "POST":
            expiry_date_str: str = request.data["membership_expiry"]
            expiry_date = datetime.datetime.strptime(expiry_date_str, "%Y-%m-%d").date()

            target_user: User = self.get_object()
            target_user.membership_expiry = expiry_date
            target_user.save()

            if target_user.discord_id is not None:
                set_member_role(target_user.discord_id)
        elif request.method == "DELETE":
            target_user: User = self.get_object()
            target_user.membership_expiry = None
            target_user.save()

            if target_user.discord_id is not None:
                remove_member_role(target_user.discord_id)

        return Response({"is_paid": True})

    @action(methods=["get"], detail=False, permission_classes=[])
    def committee(self, request):
        """
        To list our committee in the publicly accessible part of the website.
        """
        committee = User.objects.filter(is_committee=True)
        serializer = CommitteeSerializer(
            committee, many=True, context={"request": request}
        )
        return Response(serializer.data)

    @action(methods=["get"], detail=False, permission_classes=[IsCommittee | IsWalkCo])
    def inactive(self, request):
        """
        Returns a list of users who have not become a member but been on the site for 3 months
        (or been 3 months since last membership).
        """
        inactive = [
            u
            for u in User.objects.filter(
                Q(is_dormant=False)
                & (
                    (
                        Q(
                            membership_expiry__lt=timezone.now()
                            - datetime.timedelta(days=90)
                        )
                        | Q(membership_expiry=None)
                    )
                    & Q(date_joined__lt=timezone.now() - datetime.timedelta(days=90))
                )
            ).order_by("last_login")
            if not u.is_paid and len(u.get_full_name()) > 0
        ]

        discord_id_to_name = {
            m["user"]["id"]: member_username(m) for m in fetch_all_members()
        }

        from activity.models import Activity

        user_data = []
        for user in inactive:
            d = {
                "id": user.id,
                "name": user.get_full_name(),
                "last_login": user.last_login,
                "membership_expiry": user.membership_expiry,
                "date_joined": user.date_joined,
                "discord": discord_id_to_name.get(
                    user.discord_id, "<Missing from server?>"
                )
                if user.discord_id is not None
                else None,
            }

            d["last_activity"] = Activity.objects.filter(user=user).aggregate(
                last_ts=Max("timestamp")
            )["last_ts"]
            user_data.append(d)

        return Response(user_data)


class ProfileUpdateView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        file = request.data["file"]
        user = User.objects.get(pk=request.user.id)
        # TODO: Add file processing
        serialized = ProfilePictureSerializer(
            user,
            data=dict(profile_picture=file),
            context={"request": request},
            partial=True,
        )
        if serialized.is_valid():
            serialized.save()
            return Response(serialized.data)
        else:
            return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)


class SelfUserView(generics.GenericAPIView):
    """
    Simple view for getting the current user id
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serialized = FullUserSerializer(request.user, context={"request": request})
        return Response(serialized.data)


class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request):
        serializer = ExperienceSerializer(data=request.data)
        if serializer.is_valid():
            assert isinstance(
                serializer.validated_data, dict
            )  # always true when is_valid, needed for typing
            experience, created = Experience.objects.update_or_create(
                user=request.user,
                activity=serializer.validated_data["activity"],
                defaults={
                    "competency": serializer.validated_data.get("competency", None),
                    "info": serializer.validated_data.get("info", None),
                },
            )
            return Response(ExperienceSerializer(experience).data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DiscordMembersViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        existing_ids = {
            u.discord_id for u in User.objects.filter(discord_id__isnull=False)
        }
        member_names = sorted(
            [
                {
                    "id": m["user"]["id"],
                    "username": member_username(m),
                    "is_member": is_member_role(m),
                }
                for m in fetch_all_members()
                if m["user"]["id"] not in existing_ids
            ],
            key=lambda x: x["username"].lower(),  # type: ignore this is a false positive as we know username is the right type
        )

        return Response(member_names)

    def retrieve(self, request, pk=None):
        assert pk is not None
        member = get_member(pk)
        return Response({**member, "is_member": is_member_role(member)})
