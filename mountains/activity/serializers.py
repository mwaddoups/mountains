from events.serializers import BasicEventSerializer
from rest_framework import serializers
from members.serializers import SmallUserSerializer
from .models import Activity

class ActivitySerializer(serializers.HyperlinkedModelSerializer):
    user = SmallUserSerializer(read_only=True)
    event = BasicEventSerializer(read_only=True)

    class Meta:
        model = Activity
        fields = ['id', 'user', 'timestamp', 'action', 'event']