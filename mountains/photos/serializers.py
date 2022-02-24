from members.serializers import SmallUserSerializer
from rest_framework import serializers
from .models import Photo, Album

class PhotoSerializer(serializers.HyperlinkedModelSerializer):
    def create(self, validated_data):
        photo = self.context['request'].data['file']
        return Photo.objects.create(
            uploader=self.context['request'].user,  
            photo=photo,
            **validated_data
        )

    class Meta:
        model = Photo
        fields = ['id', 'uploader', 'uploaded', 'photo']
        read_only_fields = ['uploader', 'uploaded', 'photo']


class AlbumSerializer(serializers.HyperlinkedModelSerializer):
    photos = PhotoSerializer(many=True)

    class Meta:
        model = Album
        fields = ['id', 'created', 'photos']
        read_only_fields = ['id', 'created', 'photo']
