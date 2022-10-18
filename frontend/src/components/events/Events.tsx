import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api";
import { Event } from "../../models";
import { useAuth } from "../Layout";
import Loading from "../Loading";
import EventList from "./EventList";

export default function Events() {
  const [eventList, setEventList] = useState<Array<Event>>([])
  const [isLoading, setIsLoading] = useState(true);

  // Slightly complex logic needed to get the selectedEvent from the param
  const [selectedEvent, setSelectedEvent] = useState<HTMLDivElement | null>(null);

  const { eventId } = useParams();

  const { currentUser } = useAuth();
  const selectedEventRef = useCallback(node => {
    if (node !== null) {
      setSelectedEvent(node);
    }
  }, [setSelectedEvent])

  useEffect(() => {
    setIsLoading(true);
    api.get("events/").then(response => {
      setEventList(response.data);
      setIsLoading(false);
    });
  }, [setIsLoading, setEventList])

  useEffect(() => {
    selectedEvent?.scrollIntoView();
  }, [selectedEvent])

  const eventDisplay = useCallback(event => (
    <EventList 
      key={event.id} event={event} 
      eventRef={event.id.toString() === eventId ? selectedEventRef : null} />
  ), [eventId, selectedEventRef])
  
  const todayDate = new Date();
  todayDate.setHours(0,0,0,0);

  return (
    <Loading loading={isLoading}>
      <div>
        <div className="flex">
          <h1 className="text-3xl font-medium mb-2">Upcoming Events</h1>
          {currentUser?.is_committee && <Link to="new"><button className="ml-4 rounded bg-blue-500 hover:bg-blue-700 text-white text-sm p-2">Create event</button></Link>}
        </div>
        {eventList
          .filter(e => new Date(e.event_date) >= todayDate)
          .sort((e1, e2) => new Date(e1.event_date).getTime() - new Date(e2.event_date).getTime())
          .map(eventDisplay)
        }
        <h1 className="text-3xl font-medium mb-2">Past Events</h1>
        {eventList
          .filter(e => new Date(e.event_date) < todayDate)
          .sort((e1, e2) => new Date(e2.event_date).getTime() - new Date(e1.event_date).getTime())
          .map(eventDisplay)
        }
        <p>Events older than 90 days are not shown.</p>
      </div>
    </Loading>
  )
}