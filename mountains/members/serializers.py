from rest_framework import serializers
from rest_framework_nested.serializers import NestedHyperlinkedModelSerializer
from .models import User, Experience

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'mobile_number', 'email']

class SmallUserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name']

class ExperienceSerializer(NestedHyperlinkedModelSerializer):
    parent_lookup_kwargs = {
        'user_pk': 'user__pk'
    }
    class Meta:
        model = Experience
        fields = '__all__'