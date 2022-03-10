import uuid
import os
from django.db import models
from django.db.models.fields.related import ForeignKey
from django_resized import ResizedImageField
from members.models import User

def get_photos_filename(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'
    return os.path.join('uploads', 'photos', filename)

class Album(models.Model):
    name = models.CharField(max_length=200, blank=False)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.name} ({self.created})'
      
    def sample_photos(self):
        return Photo.objects.all().filter(album=self)[:5]

    def contributors(self):
        all_photos = Photo.objects.all().filter(album=self)
        all_users = all_photos.values('uploader')
        unique_users = set(u['uploader'] for u in all_users)
        return User.objects.filter(pk__in=unique_users)
    


class Photo(models.Model):
    uploader = ForeignKey(User, on_delete=models.SET_NULL, blank=False, null=True)
    uploaded = models.DateTimeField(auto_now_add=True)
    photo = ResizedImageField(
      size=[1200, 630],
      quality=70,
      upload_to=get_photos_filename
    )
    album = ForeignKey(Album, on_delete=models.SET_NULL, related_name='photos', blank=False, null=True)
