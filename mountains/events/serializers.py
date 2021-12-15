from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.HyperlinkedModelSerializer):
  class Meta:
    model = Event
    fields = ['id', 'title', 'created_date', 'event_date', 'description', 'attendees', 'max_attendees', 'organiser']
