from django.contrib import admin
from .models import Photo, Album

class PhotoAdmin(admin.ModelAdmin):
    list_display = ('id', 'uploader', 'uploaded')
    ordering = ('-uploaded', )

class AlbumAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name', )

# Register your models here.
admin.site.register(Photo, PhotoAdmin)
admin.site.register(Album, AlbumAdmin)