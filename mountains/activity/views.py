from rest_framework import viewsets, permissions
from .models import Activity
from .serializers import ActivitySerializer

class ActivityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Activity.objects.order_by('-timestamp')[:200]
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

