from rest_framework import serializers
from .models import MembershipPrice


# Create your tests here.
class MembershipPriceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = MembershipPrice
        fields = "__all__"
