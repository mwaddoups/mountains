from members.serializers import SmallUserSerializer
from rest_framework import serializers
from .models import Photo, Album

class PhotoSerializer(serializers.HyperlinkedModelSerializer):
    uploader = SmallUserSerializer(read_only=True)
    
    def create(self, validated_data):
        photo = self.context['request'].data['file']
        return Photo.objects.create(
            uploader=self.context['request'].user,  
            album_id=self.context['request'].data.get('album', None),
            photo=photo,
            **validated_data
        )

    class Meta:
        model = Photo
        fields = ['id', 'uploader', 'uploaded', 'photo', 'starred']
        read_only_fields = ['uploader', 'uploaded', 'photo']


class AlbumListSerializer(serializers.HyperlinkedModelSerializer):
    photos = PhotoSerializer(many=True, source='sample_photos') # this refers to a function on the model!
    contributors = SmallUserSerializer(many=True)

    class Meta:
        model = Album
        fields = ['id', 'name', 'event_date', 'created', 'photos', 'contributors']
        read_only_fields = ['id', 'name', 'event_date', 'created', 'photos', 'contributors']

class AlbumDetailSerializer(AlbumListSerializer):
    photos = PhotoSerializer(many=True)


class AlbumCreationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Album
        fields = ['name', 'event_date']