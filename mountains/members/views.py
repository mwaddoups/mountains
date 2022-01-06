from rest_framework import viewsets, permissions, views
from rest_framework.response import Response
from .models import User, Experience
from .serializers import ExperienceSerializer, SmallUserSerializer, UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return UserSerializer
        return SmallUserSerializer

class SelfUserView(views.APIView):
    """
    Simple view for getting the current user id
    """
    def get(self, request):
        serialized = UserSerializer(request.user, context={'request': request})
        return Response(serialized.data)

class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Experience.objects.filter(user=self.kwargs['user_pk'])