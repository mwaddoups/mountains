from rest_framework import serializers
from .models import User, Experience


class ExperienceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Experience
        fields = [
            "activity",
            "competency",
            "info",
        ]


class SmallUserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "url",
            "first_name",
            "last_name",
            "profile_picture",
            "is_approved",
            "is_committee",
            "is_walk_coordinator",
            "is_paid",
            "is_on_discord",
            "is_winter_skills",
            "mobile_number",
            "discord_id",
        ]
        read_only_fields = ["profile_picture"]


class SmallUserSerializerCommittee(SmallUserSerializer):
    class Meta:
        model = SmallUserSerializer.Meta.model
        fields = SmallUserSerializer.Meta.fields + ["in_case_emergency"]
        read_only_fields = SmallUserSerializer.Meta.read_only_fields + [
            "in_case_emergency"
        ]


class UserSerializer(SmallUserSerializer):
    experience = ExperienceSerializer(many=True, read_only=True)

    class Meta:
        model = SmallUserSerializer.Meta.model
        fields = SmallUserSerializer.Meta.fields + ["about", "experience", "email"]
        read_only_fields = SmallUserSerializer.Meta.read_only_fields + ["experience"]


class FullUserSerializer(UserSerializer):
    class Meta:
        model = UserSerializer.Meta.model
        fields = UserSerializer.Meta.fields + ["in_case_emergency"]
        read_only_fields = UserSerializer.Meta.read_only_fields


class ProfilePictureSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["id", "profile_picture"]


class CommitteeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "profile_picture",
            "committee_role",
            "committee_bio",
        ]
        read_only_fields = ["profile_picture"]
