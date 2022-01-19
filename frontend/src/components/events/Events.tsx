import React, { useEffect, useState } from "react";
import api from "../../api";
import { Event } from "../../models";
import Loading from "../Loading";
import EventList from "./EventList";

export default function Events() {
  const [eventList, setEventList] = useState<Array<Event>>([])
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.get("events/").then(response => {
      setEventList(response.data);
      setIsLoading(false);
    });
  }, [setIsLoading, setEventList])

  return (
    <Loading loading={isLoading}>
      <div>
        <h1 className="text-xl text-gray-500 italic mb-3">We are still working on the event listings - here's how they might look in future!</h1>
        {eventList.map(event => <EventList key={event.id} event={event} />)}
      </div>
    </Loading>
  )
}