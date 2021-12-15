import React, { useEffect, useState } from "react";
import api from "../api";
import { Event } from "../models";
import { useAuth } from "./Platform";

export default function Events() {
  const [eventList, setEventList] = useState<Array<Event>>([])
  const [isLoading, setIsLoading] = useState(true);

  const authToken = useAuth();

  useEffect(() => {
    setIsLoading(true);
    api.get("events/", {
      headers: {
        'Authorization': `Token ${authToken}`
      }
    }).then(response => {
      setEventList(response.data);
      setIsLoading(false);
    });
  }, [setIsLoading, setEventList, authToken])

  return (
    isLoading
    ? <h2>Loading...</h2>
    : <div>{eventList.map(event => <p key={event.id}>{JSON.stringify(event)}</p>)}</div>
  )
}