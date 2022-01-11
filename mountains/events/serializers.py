from rest_framework import serializers
from .models import Event
from members.serializers import SmallUserSerializer

class EventSerializer(serializers.HyperlinkedModelSerializer):
  organiser = SmallUserSerializer(read_only=True)
  attendees = SmallUserSerializer(many=True)

  class Meta:
    model = Event
    fields = ['id', 'title', 'created_date', 'event_date', 'description', 'attendees', 'max_attendees', 'organiser']
