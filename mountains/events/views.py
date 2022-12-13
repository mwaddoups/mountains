import datetime
import pytz
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import AttendingUser, Event, User
from .serializers import BasicEventSerializer, EventSerializer
from activity.models import Activity

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

    @action(methods=['patch', 'post'], detail=True, permission_classes=[permissions.IsAuthenticated])
    def attend(self, request, pk=None):
        event = self.get_object()
        user = request.user
        if request.method == 'POST' and request.user.is_committee:
            user_id = request.data['userId']
            user = User.objects.get(pk=user_id)

        is_driving = request.data.get('isDriving', False)

        actual_attendees = [au.user.id for au in AttendingUser.objects.filter(event=event, is_waiting_list=False).all()]
        all_attendees = list(event.attendees.all())
        if user in all_attendees:
            event.attendees.remove(user)
            if user != request.user:
                Activity.objects.create(user=request.user, event=event, action=f"removed {user.first_name} {user.last_name} from")
            else:
                Activity.objects.create(user=user, event=event, action="left")
        else:
            event_has_waiting_list = len(all_attendees) > len(actual_attendees)
            event_over_max_limit = event.max_attendees > 0 and len(actual_attendees) >= event.max_attendees
            attending_user, _was_created = AttendingUser.objects.get_or_create(user=user, event=event)
            print(attending_user)
            if event_has_waiting_list or event_over_max_limit:
                # Add to waiting list
                attending_user.is_waiting_list = True
                attending_user.is_driving = is_driving
                attending_user.save()
                if user != request.user:
                    Activity.objects.create(user=request.user, event=event, action=f"added {user.first_name} {user.last_name} to waiting list for")
                else:
                    Activity.objects.create(user=user, event=event, action="joined waiting list for")
            else:
                attending_user.is_waiting_list = False
                attending_user.is_driving = is_driving
                attending_user.save()
                if user != request.user:
                    Activity.objects.create(user=request.user, event=event, action=f"added {user.first_name} {user.last_name} to")
                else:
                    Activity.objects.create(user=user, event=event, action="joined")

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

    @action(methods=['patch', 'post'], detail=True, permission_classes=[IsCommitteeOrReadOnly])
    def changedriving(self, request, pk=None):
        event = self.get_object()
        user = request.user
        if request.method == 'POST' and request.user.is_committee:
            # POST for changing others, PATCH for changing self
            user_id = request.data['userId']
            user = User.objects.get(pk=user_id)
        wanted_au = AttendingUser.objects.filter(event=event, user=user).first()

        wanted_au.is_driving = not wanted_au.is_driving
        wanted_au.save()

        updated_event = EventSerializer(event, context={'request': request}) 
        return Response(updated_event.data)

    @action(methods=['get'], detail=False, permission_classes=[])
    def upcoming(self, request):
        today_date = datetime.datetime.combine(datetime.datetime.today(), datetime.time(0,0), tzinfo=pytz.UTC)
        upcoming_events = Event.objects.filter(event_date__gte=today_date).order_by('event_date')[:3]

        serializer = BasicEventSerializer(upcoming_events, many=True)
        return Response(serializer.data)

    @action(methods=['post'], detail=False, permission_classes=[permissions.IsAuthenticated])
    def attendedby(self, request):
        user_id = request.data['userId']
        attended_events = [au.event for au in AttendingUser.objects.filter(user=user_id)]
        attended_events = sorted(attended_events, key=lambda e: e.event_date, reverse=True)

        serializer = BasicEventSerializer(attended_events, many=True)
        return Response(serializer.data)