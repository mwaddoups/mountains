from rest_framework import serializers
from .models import FeedPost, Comment

class CommentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
      model = Comment
      fields = ['id', 'post_id', 'user_id', 'posted', 'text']


class FeedPostSerializer(serializers.HyperlinkedModelSerializer):
    comments = CommentSerializer(many=True)
    class Meta:
        model = FeedPost
        fields = ['id', 'user_id', 'posted', 'text', 'comments']