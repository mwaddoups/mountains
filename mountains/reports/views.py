from rest_framework import viewsets, permissions
from members.permissions import IsWalkCo, IsCommittee, ReadOnly
from .models import Report
from .serializers import ReportSerializer, FullReportSerializer


class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.order_by("-report_date").all()
    permission_classes = [permissions.IsAdminUser | IsWalkCo | IsCommittee | ReadOnly]

    def get_serializer_class(self):
        if self.action == "list":
            return ReportSerializer
        else:
            return FullReportSerializer
