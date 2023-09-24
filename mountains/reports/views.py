from rest_framework import viewsets, permissions
from .models import Report
from .serializers import ReportSerializer, FullReportSerializer

class IsWalkCoOrCommitteeOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, user_obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            return request.user.is_committee or request.user.is_walk_coordinator

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    permission_classes = [permissions.IsAdminUser | IsWalkCoOrCommitteeOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'list':
            return ReportSerializer
        else: 
            return FullReportSerializer