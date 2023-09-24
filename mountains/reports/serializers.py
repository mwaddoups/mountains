from rest_framework import serializers
from .models import Report

class ReportSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Report
        fields = ['id', 'title', 'report_date', 'header_image']

class FullReportSerializer(ReportSerializer):
    class Meta:
        model = Report
        fields = ['id', 'title', 'report_date', 'header_image', 'content']