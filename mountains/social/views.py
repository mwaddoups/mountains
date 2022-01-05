from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Comment, FeedPost
from .serializers import CommentSerializer, FeedPostSerializer

class FeedPostViewSet(viewsets.ModelViewSet):
    queryset = FeedPost.objects.all()
    serializer_class = FeedPostSerializer
    permission_classes = [permissions.IsAuthenticated]

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]