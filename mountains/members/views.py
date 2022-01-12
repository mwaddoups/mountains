from rest_framework import viewsets, permissions, generics, status
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from .models import Experience, User
from .serializers import ExperienceSerializer, ProfilePictureSerializer, SmallUserSerializer, UserSerializer

class IsUserOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, user_obj):
        return user_obj.id == request.user.id

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [
        permissions.IsAdminUser, 
        permissions.IsAuthenticated & IsUserOwner
    ]

    def create(self, request):
        response = {'message': 'User creation not allowed on this path.'}
        return Response(response, status=status.HTTP_403_FORBIDDEN)

    def get_serializer_class(self):
        if self.action == 'list':
            return SmallUserSerializer
        return UserSerializer

class ProfileUpdateView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        file = request.data['file']
        user = User.objects.get(pk=request.user.id)
        # TODO: Add file processing
        serialized = ProfilePictureSerializer(user, data=dict(profile_picture=file), context={'request': request}, partial=True)
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
        serialized = UserSerializer(request.user, context={'request': request})
        return Response(serialized.data)


class IsExperienceOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, experience_obj):
        return experience_obj.user.id == request.user.id

class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [
        permissions.IsAdminUser, 
        permissions.IsAuthenticated & IsExperienceOwner
    ]
