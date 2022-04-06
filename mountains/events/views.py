import datetime
import pytz
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Event
from .serializers import EventSerializer, FrontPageEventSerializer

class IsCommitteeOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, user_obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            return request.user.is_committee

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('-event_date')
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAdminUser | (permissions.IsAuthenticated & IsCommitteeOrReadOnly)]

    @action(methods=['patch'], detail=True, permission_classes=[permissions.IsAuthenticated])
    def attend(self, request, pk=None):
        event = self.get_object()
        user = request.user
        if user in event.attendees.all():
            event.attendees.remove(user)
        else:
            event.attendees.add(user)

        updated_event = EventSerializer(event, context={'request': request}) 
        return Response(updated_event.data)

    @action(methods=['get'], detail=False, permission_classes=[])
    def upcoming(self, request):
        upcoming_events = Event.objects.filter(event_date__gte=datetime.datetime.now(tz=pytz.UTC) - datetime.timedelta(hours=12)).order_by('event_date')[:3]

        serializer = FrontPageEventSerializer(upcoming_events, many=True)
        return Response(serializer.data)