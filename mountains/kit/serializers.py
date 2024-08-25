from members.serializers import SmallUserSerializer
from rest_framework import serializers

from .models import Kit, KitBorrow


class KitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kit
        fields = "__all__"


class SmallKitSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Kit
        fields = ["id", "text_id", "description"]


class KitBorrowSerializer(serializers.HyperlinkedModelSerializer):
    user = SmallUserSerializer(read_only=True)
    kit = SmallKitSerializer(read_only=True)

    class Meta:
        model = KitBorrow
        fields = "__all__"
