from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import FeedPost
from .serializers import FeedPostSerializer

class FeedPostViewSet(viewsets.ModelViewSet):
    queryset = FeedPost.objects.all()
    serializer_class = FeedPostSerializer
    permission_classes = [permissions.IsAuthenticated]