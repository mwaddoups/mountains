from members.serializers import UserSerializer
from members.models import User
from rest_framework import serializers
from .models import FeedPost, Comment

class CommentSerializer(serializers.HyperlinkedModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
      model = Comment
      fields = ['id', 'post_id', 'user', 'posted', 'text']
      read_only_fields = ['id', 'post_id', 'user', 'posted']


class FeedPostSerializer(serializers.HyperlinkedModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)

    def create(self, validated_data):
        # Use authenticated user to author the post

        return FeedPost.objects.create(
            user=self.context['request'].user,
            **validated_data
        )
        
    class Meta:
        model = FeedPost
        fields = ['id', 'user', 'posted', 'text', 'comments']
        read_only_fields = ['id', 'posted']