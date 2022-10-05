from rest_framework import serializers
from .models import Event, AttendingUser
from members.serializers import SmallUserSerializer, SmallUserSerializerCommittee


class AttendingUserField(serializers.RelatedField):
  def to_representation(self, value):
    au_data = value.filter(event=self.context['event_id']).first()

    return {'is_waiting_list': au_data.is_waiting_list}

class AttendingUserSerializer(serializers.HyperlinkedModelSerializer):
  au_data = AttendingUserField(source='attendinguser_set', read_only=True)

  class Meta:
    model = SmallUserSerializerCommittee.Meta.model
    fields = SmallUserSerializerCommittee.Meta.fields + ['au_data']
    read_only_fields = SmallUserSerializerCommittee.Meta.read_only_fields + ['au_data']

class EventSerializer(serializers.HyperlinkedModelSerializer):
  organiser = SmallUserSerializer(read_only=True)
  attendees = serializers.SerializerMethodField()

  def get_attendees(self, event):
    return AttendingUserSerializer(
      event.attendees.all(), 
      many=True, read_only=True, context={'event_id': event, 'request': self.context['request']}
    ).data

  def create(self, validated_data):
    return Event.objects.create(
      organiser=self.context['request'].user,
      **validated_data,
    )

  class Meta:
    model = Event
    fields = ['id', 'title', 'created_date', 'event_date', 'description', 'attendees', 'max_attendees', 'organiser', 'show_popup']

class FrontPageEventSerializer(serializers.HyperlinkedModelSerializer):
  class Meta:
    model = Event
    fields = ['id', 'title', 'created_date', 'event_date', 'description']
