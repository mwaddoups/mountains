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

class Photo(models.Model):
    uploader = ForeignKey(User, on_delete=models.SET_NULL, blank=False, null=True)
    uploaded = models.DateTimeField(auto_now_add=True)
    photo = ResizedImageField(
      size=[1200, 630],
      crop=['middle', 'center'],
      quality=70,
      upload_to=get_photos_filename
    )
