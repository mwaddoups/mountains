from members.serializers import UserSerializer
from rest_framework import serializers
from .models import FeedPost, Comment

class CommentSerializer(serializers.HyperlinkedModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
      model = Comment
      fields = ['id', 'post_id', 'user', 'posted', 'text']
      read_only_fields = ['id', 'post_id', 'user', 'posted']


class FeedPostSerializer(serializers.HyperlinkedModelSerializer):
    comments = CommentSerializer(many=True)
    user = UserSerializer(read_only=True)
    class Meta:
        model = FeedPost
        fields = ['id', 'user', 'posted', 'text', 'comments']
        read_only_fields = ['id', 'user', 'posted']