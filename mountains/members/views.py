from rest_framework import viewsets, permissions, generics, status, views
from rest_framework.decorators import permission_classes, action
from rest_framework.response import Response
from django.core.mail import send_mail
from .discord import (
    get_member,
    fetch_all_members,
    member_username,
    set_member_role,
    remove_member_role,
    MEMBER_ROLE_ID,
)
from .permissions import ReadOnly, IsCommittee
from .models import Experience, User
from .serializers import (
    CommitteeSerializer,
    ExperienceSerializer,
    FullUserSerializer,
    ProfilePictureSerializer,
    SmallUserSerializerCommittee,
    SmallUserSerializer,
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

    def get_serializer_class(self):
        if not isinstance(self.request.user, User):
            # This should never happen because of permissions
            return SmallUserSerializer

        if self.action == "list":
            if self.request.user.is_committee:
                return SmallUserSerializerCommittee
            else:
                return SmallUserSerializer
        else:
            # In detail view, we get .get_object()
            if (
                self.request.user.is_committee
                or self.request.user.id == self.get_object().id
            ):
                return FullUserSerializer
            else:
                return UserSerializer

    @action(methods=["post"], detail=True, permission_classes=[IsCommittee])
    def paid(self, request, pk=None):
        """
        We need a separate method for this to enforce committee positions
        """
        target_user: User = self.get_object()
        target_user.is_paid = not target_user.is_paid
        target_user.save()

        if target_user.discord_id is not None:
            if target_user.is_paid:
                set_member_role(target_user.discord_id)
            else:
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
    def list(self, request):
        member_names = sorted(
            [
                {
                    "id": m["user"]["id"],
                    "username": member_username(m),
                    "is_member": MEMBER_ROLE_ID in m["roles"],
                }
                for m in fetch_all_members()
            ],
            key=lambda x: x["username"],
        )

        return Response(member_names)

    def retrieve(self, request, pk=None):
        assert pk is not None
        member = get_member(pk)
        member["is_member"] = MEMBER_ROLE_ID in member["roles"]
        return Response(member)
