from django.contrib import admin
from .models import KitBorrow, Kit

admin.site.register(Kit)
admin.site.register(KitBorrow)
