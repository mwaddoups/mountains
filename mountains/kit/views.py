from rest_framework import viewsets, permissions
from .models import Kit, KitBorrow
from .serializers import KitSerializer, KitBorrowSerializer

class IsWalkCoOrCommitteeOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, user_obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            return request.user.is_committee or request.user.is_walk_coordinator

class KitViewSet(viewsets.ModelViewSet):
    queryset = Kit.objects.all()
    permission_classes = [permissions.IsAdminUser | IsWalkCoOrCommitteeOrReadOnly]
    serializer_class = KitSerializer

class KitBorrowViewSet(viewsets.ModelViewSet):
    queryset = KitBorrow.objects.all()
    permission_classes = [permissions.IsAdminUser | IsWalkCoOrCommitteeOrReadOnly]
    serializer_class = KitBorrowSerializer