from members.serializers import SmallUserSerializer
from rest_framework import serializers
from .models import FeedPost, Comment

class CommentSerializer(serializers.HyperlinkedModelSerializer):
    user = SmallUserSerializer(read_only=True)

    def create(self, validated_data):
        # Use authenticated user to author the comment
        return Comment.objects.create(
            user=self.context['request'].user,
            **validated_data
        )
    class Meta:
      model = Comment
      fields = ['id', 'post_id', 'user', 'posted', 'text']
      read_only_fields = ['user', 'posted']


class FeedPostSerializer(serializers.HyperlinkedModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    user = SmallUserSerializer(read_only=True)

    def create(self, validated_data):
        # Use authenticated user to author the post
        return FeedPost.objects.create(
            user=self.context['request'].user,
            **validated_data
        )

    class Meta:
        model = FeedPost
        fields = ['id', 'url', 'user', 'posted', 'text', 'comments']
        read_only_fields = ['posted']