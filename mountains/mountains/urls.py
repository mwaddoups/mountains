"""mountains URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers

from members.views import ExperienceViewSet, UserViewSet, SelfUserView, ProfileUpdateView
from events.views import EventViewSet
from social.views import FeedPostViewSet, CommentViewSet
from photos.views import PhotoViewSet, AlbumViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'events', EventViewSet)
router.register(r'experiences', ExperienceViewSet)
router.register(r'posts', FeedPostViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'photos', PhotoViewSet)
router.register(r'albums', AlbumViewSet)

urlpatterns = [
    path(r'users/self/', SelfUserView.as_view()),
    path(r'users/profile/', ProfileUpdateView.as_view()),
    path(r'', include(router.urls)),
    path(r'admin/', admin.site.urls),
    path(r'api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path(r'', include('drfpasswordless.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
