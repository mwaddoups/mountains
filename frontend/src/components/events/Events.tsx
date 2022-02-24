import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import { Event } from "../../models";
import Loading from "../Loading";
import EventList from "./EventList";

export default function Events() {
  const [eventList, setEventList] = useState<Array<Event>>([])
  const [isLoading, setIsLoading] = useState(true);

  // Slightly complex logic needed to get the selectedEvent from the param
  const [selectedEvent, setSelectedEvent] = useState<HTMLDivElement | null>(null);
  const { eventId } = useParams();
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