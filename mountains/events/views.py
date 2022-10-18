import datetime
import pytz
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import AttendingUser, Event
from .serializers import EventSerializer, FrontPageEventSerializer

class IsCommitteeOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, user_obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            return request.user.is_committee

class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAdminUser | (permissions.IsAuthenticated & IsCommitteeOrReadOnly)]

    def get_queryset(self, *args, **kwargs):
        ago_90d = datetime.datetime.now() - datetime.timedelta(days=90)
        return Event.objects.filter(event_date__gte=ago_90d).order_by('-event_date')

    @action(methods=['patch'], detail=True, permission_classes=[permissions.IsAuthenticated])
    def attend(self, request, pk=None):
        event = self.get_object()
        user = request.user
        actual_attendees = [au.user.id for au in AttendingUser.objects.filter(event=event, is_waiting_list=False).all()]
        if user in event.attendees.all():
            event.attendees.remove(user)
            if user.id in actual_attendees:
                # We can add a new person from the waitlist, if there is one
                first_waiting = AttendingUser.objects.filter(event=event, is_waiting_list=True).first()
                if first_waiting:
                    first_waiting.is_waiting_list = False
                    first_waiting.save()
        else:
            if event.max_attendees > 0 and len(actual_attendees) >= event.max_attendees:
                new_au = AttendingUser(user=user, event=event, is_waiting_list=True)
                new_au.save()
            else:
                event.attendees.add(user)

        updated_event = EventSerializer(event, context={'request': request}) 
        return Response(updated_event.data)

    @action(methods=['post'], detail=True, permission_classes=[IsCommitteeOrReadOnly])
    def changelist(self, request, pk=None):
        event = self.get_object()
        user_id = request.data['userId']
        wanted_au = AttendingUser.objects.filter(event=event, user=user_id).first()

        wanted_au.is_waiting_list = not wanted_au.is_waiting_list
        wanted_au.save()

        updated_event = EventSerializer(event, context={'request': request}) 
        return Response(updated_event.data)

    @action(methods=['get'], detail=False, permission_classes=[])
    def upcoming(self, request):
        today_date = datetime.datetime.combine(datetime.datetime.today(), datetime.time(0,0), tzinfo=pytz.UTC)
        upcoming_events = Event.objects.filter(event_date__gte=today_date).order_by('event_date')[:3]

        serializer = FrontPageEventSerializer(upcoming_events, many=True)
        return Response(serializer.data)