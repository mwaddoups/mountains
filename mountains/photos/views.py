from wsgiref.handlers import read_environ
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Photo, Album
from .serializers import AlbumDetailSerializer, PhotoSerializer, AlbumSerializer

class PhotoViewSet(viewsets.ModelViewSet):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(methods=['get'], detail=False, permission_classes=[])
    def recent(self, request):
        recent_photos = Photo.objects.all().order_by('-uploaded')[:5]

        serializer = self.get_serializer(recent_photos, many=True)
        return Response(serializer.data)

class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return AlbumDetailSerializer
        return AlbumSerializer
