import types

from activity.models import Activity
from members.serializers import SmallUserSerializer, SmallUserSerializerCommittee
from rest_framework import serializers

from .models import AttendingUser, Event


class AttendingUserSerializer(serializers.HyperlinkedModelSerializer):
    au_id = serializers.ReadOnlyField(source="id")
    id = serializers.ReadOnlyField(source="user.id")
    first_name = serializers.ReadOnlyField(source="user.first_name")
    last_name = serializers.ReadOnlyField(source="user.last_name")
    profile_picture = serializers.FileField(source="user.profile_picture")
    is_approved = serializers.ReadOnlyField(source="user.is_approved")
    is_committee = serializers.ReadOnlyField(source="user.is_committee")
    is_walk_coordinator = serializers.ReadOnlyField(source="user.is_walk_coordinator")
    is_paid = serializers.ReadOnlyField(source="user.is_paid")
    membership_expiry = serializers.ReadOnlyField(source="user.membership_expiry")
    mobile_number = serializers.ReadOnlyField(source="user.mobile_number")
    in_case_emergency = serializers.ReadOnlyField(source="user.in_case_emergency")

    class Meta:
        model = AttendingUser
        fields = [
            "au_id",
            "id",
            "first_name",
            "last_name",
            "profile_picture",
            "is_approved",
            "is_committee",
            "is_paid",
            "membership_expiry",
            "mobile_number",
            "in_case_emergency",
            "is_waiting_list",
            "is_trip_paid",
            "is_walk_coordinator",
            "list_join_date",
        ]


class EventSerializer(serializers.HyperlinkedModelSerializer):
    organiser = SmallUserSerializer(read_only=True)
    attendees = AttendingUserSerializer(
        source="attendinguser_set", many=True, read_only=True
    )

    def create(self, validated_data):
        print(validated_data)
        created = Event.objects.create(
            organiser=self.context["request"].user,
            **validated_data,
        )
        try:
            Activity.objects.create(
                user=self.context["request"].user, event=created, action="created"
            )
        except:
            print("Error creating activity - ignoring...")

        return created

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "created_date",
            "event_date",
            "event_end_date",
            "event_type",
            "description",
            "attendees",
            "max_attendees",
            "organiser",
            "show_popup",
            "members_only",
            "signup_open",
            "is_deleted",
            "signup_open_date",
            "is_open",
            "price_id",
        ]


class BasicEventSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Event
        fields = ["id", "title", "created_date", "event_date", "event_type"]
