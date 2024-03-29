import React, { useEffect, useState } from "react";
import api from "../../api";
import { BasicEvent } from "../../models";
import CalendarDate from "../events/CalendarDate";
import Loading from "../Loading";

export default function LandingEvents() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Array<BasicEvent>>([])

  useEffect(() => {
    setLoading(true);
    api.get("events/upcoming/").then(response => {
      setEvents(response.data);
      setLoading(false);
    });
  }, [])

  return (
    <Loading loading={loading}> 
      <div>
        {events.map((event, ix) => (
          <div key={ix} className="w-full h-30 p-2 border rounded shadow flex items-center mb-1">
            <div className="flex-none">
              <CalendarDate dateStr={event.event_date} showTime={false}/>
            </div>
            
            <h1 className="text-gray-900 text-lg font-medium text-bold">{event.title}</h1> 

          </div>
        ))}
      </div>
    </Loading>
  )
}