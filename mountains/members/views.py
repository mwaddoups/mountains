from members.discord import set_member_role
from rest_framework import viewsets, permissions, generics, status, views
from rest_framework.decorators import permission_classes, action
from rest_framework.response import Response
from django.core.mail import send_mail
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
    def approve(self, request, pk=None):
        target_user = self.get_object()
        target_user.is_approved = True
        target_user.save()

        email_body = (
            "Thank you for registering!\n\n"
            "You have now been approved and should have full access to our site at http://clydemc.org.\n"
            "There are more details on there about joining our Discord channel and getting involved.\n\n"
            "See you there!"
        )
        email_html = (
            "<h1>Thank you for registering!</h1>\n"
            "<p>You have now been approved and should have full access to our site at <a href='http://clydemc.org'>http://clydemc.org</a>.</p>\n"
            "<p>There are more details on there about joining our Discord channel and getting involved.</p>\n"
            "<p>See you there!</p>"
        )

        send_mail(
            "Clyde Mountaineering Club - Approved",
            email_body,
            "noreply@clydemc.org",
            [target_user.email],
            fail_silently=True,
            html_message=email_html,
        )

        return Response({"is_approved": True})

    @action(methods=["post"], detail=True, permission_classes=[IsCommittee])
    def paid(self, request, pk=None):
        target_user = self.get_object()
        target_user.is_paid = not target_user.is_paid
        target_user.save()

        return Response({"is_paid": True})

    @action(methods=["get"], detail=False, permission_classes=[])
    def committee(self, request):
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


class DiscordMemberView(views.APIView):
    permission_classes = [IsCommittee]

    def put(self, request):
        user_id = request.data["user_id"]
        user = User.objects.get(id=user_id)
        if user.discord_id is not None:
            set_member_role(user.discord_id)
            return Response({"details": "Set discord ID to Member!"})
        else:
            return Response({"details": "User has no discord ID!"})

    def delete(self, request):
        user_id = request.data["user_id"]
        user = User.objects.get(id=user_id)
