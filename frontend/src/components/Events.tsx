import React, { useEffect, useState } from "react";
import api from "../api";
import { Event } from "../models";
import Loading from "./Loading";
import { useAuth } from "./Platform";

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
      <div>{eventList.map(event => <p key={event.id}>{JSON.stringify(event)}</p>)}</div>
    </Loading>
  )
}