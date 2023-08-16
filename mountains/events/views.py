import datetime
import pytz
import itertools
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import AttendingUser, Event, User
from .serializers import BasicEventSerializer, EventSerializer
from activity.models import Activity
from django.utils import timezone
from django.core.mail import send_mail, EmailMultiAlternatives

def user_allowed_edit_events(user):
    return user.is_committee or user.is_walk_coordinator

class IsEventEditorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, user_obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            return user_allowed_edit_events(request.user)

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAdminUser | (permissions.IsAuthenticated & IsEventEditorOrReadOnly)]

    def list(self, request):
        future = datetime.datetime.combine(datetime.date.today(), datetime.time(0))
        future_events = Event.objects.filter(event_date__gte=future, is_deleted=False).order_by('event_date')
        past_events = Event.objects.filter(event_date__lt=future, is_deleted=False).order_by('-event_date')
        raw_events = itertools.chain(future_events, past_events)


        selected_id = self.request.query_params.get('selectedId')
        if selected_id is None:
            limit = int(self.request.query_params.get('limit'))
            offset = int(self.request.query_params.get('offset'))
            events = list(itertools.islice(raw_events, offset, offset + limit))

            last_offset = limit + offset
        else:
            selected_id = int(selected_id)
            events = []
            for event in raw_events:
                events.append(event)
                if event.id == selected_id:
                    break

            last_offset = len(events)
                    
            

        serializer = self.serializer_class(events, many=True, context={'request': request})
        return Response({
            'results': serializer.data,
            'last_offset': last_offset
        })

    @action(methods=['patch', 'post'], detail=True, permission_classes=[permissions.IsAuthenticated])
    def attend(self, request, pk=None):
        event = self.get_object()
        user = request.user
        if request.method == 'POST' and user_allowed_edit_events(request.user):
            user_id = request.data['userId']
            user = User.objects.get(pk=user_id)

        is_trip_paid = request.data.get('isTripPaid', False)

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
                attending_user.is_trip_paid = is_trip_paid
                attending_user.save()
                if user != request.user:
                    Activity.objects.create(user=request.user, event=event, action=f"added {user.first_name} {user.last_name} to waiting list for")
                else:
                    Activity.objects.create(user=user, event=event, action="joined waiting list for")
            else:
                attending_user.is_waiting_list = False
                attending_user.is_trip_paid = is_trip_paid
                attending_user.save()
                if user != request.user:
                    Activity.objects.create(user=request.user, event=event, action=f"added {user.first_name} {user.last_name} to")
                else:
                    Activity.objects.create(user=user, event=event, action="joined")

        updated_event = EventSerializer(event, context={'request': request}) 
        return Response(updated_event.data)

    @action(methods=['post'], detail=True, permission_classes=[IsEventEditorOrReadOnly])
    def changelist(self, request, pk=None):
        event = self.get_object()
        user_id = request.data['userId']
        wanted_au = AttendingUser.objects.filter(event=event, user=user_id).first()

        wanted_au.is_waiting_list = not wanted_au.is_waiting_list
        wanted_au.list_join_date = timezone.now()
        wanted_au.save()

        updated_event = EventSerializer(event, context={'request': request}) 
        return Response(updated_event.data)

    @action(methods=['patch', 'post'], detail=True, permission_classes=[IsEventEditorOrReadOnly])
    def changepaid(self, request, pk=None):
        event = self.get_object()
        user = request.user
        if request.method == 'POST' and user_allowed_edit_events(request.user):
            # POST for changing others, PATCH for changing self
            user_id = request.data['userId']
            user = User.objects.get(pk=user_id)
        wanted_au = AttendingUser.objects.filter(event=event, user=user).first()

        wanted_au.is_trip_paid = not wanted_au.is_trip_paid
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
        attended_events = [au.event for au in AttendingUser.objects.filter(user=user_id, is_waiting_list=False)]
        attended_events = sorted(
            [e for e in attended_events if e.event_date < timezone.now() + datetime.timedelta(days=1)], 
            key=lambda e: e.event_date, reverse=True
        )

        serializer = BasicEventSerializer(attended_events, many=True)
        return Response(serializer.data)

    @action(methods=['get'], detail=False, permission_classes=[permissions.IsAuthenticated])
    def needsmembership(self, request):
        """Returns a list of users who have attended 1 or more walks but aren't yet a member"""
        attended_users = {}
        for au in AttendingUser.objects.all():
            if not au.user.is_paid and au.event.event_type in ('SD', 'SW', 'WD', 'WW') and au.event.event_date < timezone.now() and not au.is_waiting_list:
                if au.user.id not in attended_users:
                    attended_users[au.user.id] = {'user': au.user, 'count': 1}
                else:
                    attended_users[au.user.id]['count'] += 1

        users_to_prompt = sorted([
            {'name': d['user'].first_name + ' ' + d['user'].last_name, 'count': d['count']}
            for d in attended_users.values()
        ], key=lambda x: x['count'], reverse=True)


        return Response(users_to_prompt)

    @action(methods=['post'], detail=True, permission_classes = [IsEventEditorOrReadOnly])
    def reminderemail(self, request, pk=None):
        event = self.get_object()
        attendee_emails = list([u.email for u in event.attendees.all()])

        email_subject = f'Reminder: CMC walk, {event.title}'

        email_body =  (
            f"This is a reminder that you have signed up or are on the waiting list for {event.title} on {event.event_date.strftime('%Y-%m-%d')}!\n\n"
            "If you still wish to attend, you must confirm your place on Discord in the associated walk thread."
            "Discord will also be used for any updates this week, as well as organising lifts and handing out waiting list places - so please keep an eye on it!\n\n"
            "If you can no longer attend or no longer wish to be on the waiting list, please update your attendance on the site and let the organiser know. "
            "If we are unable to reach you on Discord in the next couple days, we will remove you from the event.\n\n"
            "Looking forward to the walk and will hopefully see you there!"
        )
        email_html =  (
            f"<h1>Confirm your place: {event.title}, {event.event_date.strftime('%Y-%m-%d')}</h1>"
            f"<p>This is a reminder that you have signed up or are on the waiting list for {event.title} on {event.event_date.strftime('%Y-%m-%d')}!</p>\n"
            '<p style="font-weight: bold;">If you still wish to attend, you must confirm your place on Discord in the associated walk thread.</p>\n'
            "<p>Discord will also be used for any updates this week, as well as organising lifts and handing out waiting list places - so please keep an eye on it!</p>\n"
            "<p>If you can no longer attend or no longer wish to be on the waiting list, please update your attendance on the site and let the organiser know. "
            "If we are unable to reach you on Discord in the next couple days, we will remove you from the event.</p>\n"
            "<p>Looking forward to the walk and will hopefully see you there!</p>"
        )

        for attendee_email in attendee_emails:
            email = EmailMultiAlternatives(
                subject=email_subject,
                body=email_body,
                from_email="noreply@clydemc.org",
                to=[attendee_email],
            )
            email.attach_alternative(email_html, "text/html")
            email.send(fail_silently=True)


        return Response({'is_approved': True})