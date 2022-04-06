from rest_framework import serializers
from .models import Event
from members.serializers import SmallUserSerializer, SmallUserSerializerCommittee
class EventSerializer(serializers.HyperlinkedModelSerializer):
  organiser = SmallUserSerializer(read_only=True)
  attendees = SmallUserSerializerCommittee(many=True, read_only=True)

  def create(self, validated_data):
    return Event.objects.create(
      organiser=self.context['request'].user,
      **validated_data,
    )

  class Meta:
    model = Event
    fields = ['id', 'title', 'created_date', 'event_date', 'description', 'attendees', 'max_attendees', 'organiser']

class FrontPageEventSerializer(serializers.HyperlinkedModelSerializer):
  class Meta:
    model = Event
    fields = ['id', 'title', 'created_date', 'event_date', 'description']
