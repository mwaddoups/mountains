from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from .models import User, Experience
from .serializers import ExperienceSerializer, ProfilePictureSerializer, SmallUserSerializer, UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

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

class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Experience.objects.filter(user=self.kwargs['user_pk'])