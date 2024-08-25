from members.models import User
from members.serializers import SmallUserSerializer
from rest_framework import serializers

from .models import Kit, KitBorrow


class KitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kit
        fields = "__all__"


class SmallKitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kit
        fields = ["id", "text_id", "description"]


class UserField(serializers.RelatedField):
    def to_representation(self, value):
        return SmallUserSerializer(value, context=self.context).data

    def to_internal_value(self, user_id):
        # Allow us to post IDs as integers
        return User.objects.get(id=user_id)


class KitField(serializers.RelatedField):
    def to_representation(self, value):
        return SmallKitSerializer(value, context=self.context).data

    def to_internal_value(self, kit_id: int):
        # Allow us to post IDs as integers
        return Kit.objects.get(id=kit_id)


class KitBorrowSerializer(serializers.ModelSerializer):
    user = UserField(queryset=User.objects.all())
    kit = KitField(queryset=Kit.objects.all())

    class Meta:
        model = KitBorrow
        fields = "__all__"
