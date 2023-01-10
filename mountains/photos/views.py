from wsgiref.handlers import read_environ
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Photo, Album
from .serializers import AlbumCreationSerializer, AlbumDetailSerializer, PhotoSerializer, AlbumSerializer

class IsCommitteeOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, user_obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            return request.user.is_committee

class PhotoViewSet(viewsets.ModelViewSet):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(methods=['get'], detail=False, permission_classes=[])
    def recent(self, request):
        recent_photos = Photo.objects.all().order_by('-uploaded')[:5]

        serializer = self.get_serializer(recent_photos, many=True)
        return Response(serializer.data)

    @action(methods=['post'], detail=True, permission_classes=[IsCommitteeOrReadOnly])
    def star(self, request, pk=None):
        photo = self.get_object()
        photo.starred = not photo.starred
        photo.save()
        serialized = self.get_serializer(photo)
        return Response(serialized.data)

class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.all()
    permission_classes = [permissions.IsAdminUser | (permissions.IsAuthenticated & IsCommitteeOrReadOnly)]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return AlbumDetailSerializer
        elif self.action == 'create':
            return AlbumCreationSerializer
        else:
            return AlbumSerializer
