from rest_framework import viewsets, permissions
from .models import Photo
from .serializers import PhotoSerializer

class PhotoViewSet(viewsets.ModelViewSet):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    permission_classes = [permissions.IsAuthenticated]