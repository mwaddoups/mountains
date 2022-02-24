from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Event
from .serializers import EventSerializer

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('-event_date')
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

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
