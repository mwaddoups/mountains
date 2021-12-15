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
from rest_framework_nested import routers

from members.views import ExperienceViewSet, UserViewSet, SelfUserView
from events.views import EventViewSet
from social.views import FeedPostViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'events', EventViewSet)
router.register(r'posts', FeedPostViewSet)

domains_router = routers.NestedDefaultRouter(router, r'users', lookup='user')
domains_router.register(r'experience', ExperienceViewSet, basename='experience')

urlpatterns = [
    path(r'users/self/', SelfUserView.as_view()),
    path(r'', include(router.urls)),
    path(r'', include(domains_router.urls)),
    path(r'admin/', admin.site.urls),
    path(r'api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path(r'', include('drfpasswordless.urls')),
]
