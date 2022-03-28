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

  return (
    <Loading loading={isLoading}>
      <div>
        {currentUser?.is_committee && <Link to="new"><button className="rounded bg-blue-500 hover:bg-blue-700 text-white text-sm p-2">Create event</button></Link>}
        {eventList.map(event => (
          <EventList 
            key={event.id} event={event} 
            eventRef={event.id.toString() === eventId ? selectedEventRef : null} />
          )
        )}
      </div>
    </Loading>
  )
}