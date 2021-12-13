from rest_framework import serializers
from .models import User, Event

class UserSerializer(serializers.HyperlinkedModelSerializer):
  class Meta:
    model = User
    fields = ['first_name', 'last_name', 'mobile_number', 'email']

class EventSerializer(serializers.HyperlinkedModelSerializer):
  class Meta:
    model = Event
    fields = ['title', 'created_date', 'event_date', 'description', 'attendees', 'max_attendees', 'organiser']
