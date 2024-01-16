from rest_framework import viewsets, permissions
from .models import Kit, KitBorrow
from .serializers import KitSerializer, KitBorrowSerializer
from members.permissions import IsCommittee, IsWalkCo, ReadOnly


class KitViewSet(viewsets.ModelViewSet):
    queryset = Kit.objects.all()
    permission_classes = [permissions.IsAdminUser | IsWalkCo | IsCommittee | ReadOnly]
    serializer_class = KitSerializer

class KitBorrowViewSet(viewsets.ModelViewSet):
    queryset = KitBorrow.objects.all()
    permission_classes = [permissions.IsAdminUser | IsWalkCo | IsCommittee | ReadOnly]
    serializer_class = KitBorrowSerializer