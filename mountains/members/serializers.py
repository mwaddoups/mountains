from rest_framework import serializers
from .models import User, Experience

class ExperienceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Experience
        fields = [
           'activity',
           'competency',
           'info',
        ]

class UserSerializer(serializers.HyperlinkedModelSerializer):
    experience = ExperienceSerializer(many=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'first_name', 'last_name', 'mobile_number', 
            'about', 'experience', 'profile_picture', 'is_approved', 'is_committee'
        ]
        read_only_fields = ['profile_picture']

class SmallUserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'url', 'first_name', 'last_name', 'profile_picture', 
            'is_approved', 'is_committee'
        ]
        read_only_fields = ['profile_picture']

class ProfilePictureSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'profile_picture']
