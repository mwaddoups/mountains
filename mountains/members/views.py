from members.serializers import UserSerializer
from rest_framework import viewsets, permissions
from rest_framework.decorators import permission_classes
from .models import User

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
