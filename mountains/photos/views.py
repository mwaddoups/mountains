from wsgiref.handlers import read_environ
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from members.permissions import IsWalkCo, IsCommittee, ReadOnly
from .models import Photo, Album
from .serializers import AlbumCreationSerializer, AlbumDetailSerializer, PhotoSerializer, AlbumListSerializer


class PhotoViewSet(viewsets.ModelViewSet):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(methods=['get'], detail=False, permission_classes=[])
    def recent(self, request):
        recent_photos = Photo.objects.filter(starred=True).order_by('-uploaded')[:12]

        serializer = self.get_serializer(recent_photos, many=True)
        return Response(serializer.data)


class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.all()
    permission_classes = [permissions.IsAdminUser | (permissions.IsAuthenticated & (IsWalkCo | IsCommittee | ReadOnly))]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return AlbumDetailSerializer
        elif self.action == 'create':
            return AlbumCreationSerializer
        else:
            return AlbumListSerializer
