import React, { useCallback, useEffect, useState } from "react";
import { ArrowLeftCircleFill, ArrowRightCircleFill } from "react-bootstrap-icons";
import { Link, useParams } from "react-router-dom";
import api from "../../api";
import { Event, EventType } from "../../models";
import { Badge } from "../base/Base";
import { useAuth } from "../Layout";
import Loading from "../Loading";
import EventList, { eventTypeMap } from "./EventList";

export default function Events() {
  const [eventList, setEventList] = useState<Array<Event>>([])
  const [filters, setFilters] = useState<Array<EventType>>(Object.keys(eventTypeMap) as Array<EventType>)
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
          <h1 className="text-xl md:text-3xl font-medium mb-2">Upcoming Events</h1>
          {currentUser?.is_committee && <Link to="../new"><button className="ml-4 rounded bg-blue-500 hover:bg-blue-700 text-white text-sm p-2">Create event</button></Link>}
        </div>
        <EventFilter filters={filters} setFilters={setFilters} />
        {eventList
          .filter(e => new Date(e.event_date) >= todayDate)
          .filter(e => filters.includes(e.event_type))
          .sort((e1, e2) => new Date(e1.event_date).getTime() - new Date(e2.event_date).getTime())
          .map(eventDisplay)
        }
        <h1 className="text-xl md:text-3xl font-medium mb-2">Past Events</h1>
        {eventList
          .filter(e => new Date(e.event_date) < todayDate)
          .filter(e => filters.includes(e.event_type))
          .sort((e1, e2) => new Date(e2.event_date).getTime() - new Date(e1.event_date).getTime())
          .map(eventDisplay)
        }
        <p>Events older than 90 days are not shown.</p>
      </div>
    </Loading>
  )
}

interface EventFilterProps {
  filters: Array<EventType>,
  setFilters: (a: Array<EventType>) => void,
}

function EventFilter({ filters, setFilters }: EventFilterProps) {
  let allFilters = Object.keys(eventTypeMap) as Array<EventType>
  let [expanded, setExpanded] = useState(false)

  let handleClick = useCallback(e => {
    let wanted_type = e.target.id;
    if (filters.includes(wanted_type)) {
      setFilters(filters.filter(e => e !== wanted_type))
    } else {
      setFilters(filters.concat([wanted_type]))
    }
  }, [filters, setFilters])
  return (
    <div className={"flex" + (expanded ? " flex-wrap" : "")}>
      <h3 className="text-sm mr-2 text-gray-500">Filter</h3>
      <span className="select-none cursor-pointer text-gray-500 mr-1" onClick={() => setExpanded(!expanded)}>{expanded ? <ArrowLeftCircleFill /> : <ArrowRightCircleFill />}</span>
      {allFilters.map(event_type => (
        <Badge 
          key={event_type}
          $badgeColor={eventTypeMap[event_type][1]} 
          className={"select-none cursor-pointer my-0.5" + (expanded ? (filters.includes(event_type) ? " opacity-100" : " opacity-50") : " opacity-0 !hidden")}
          onClick={handleClick} id={event_type}>
            {eventTypeMap[event_type][0]}
        </Badge>
      ))}

    </div>
  )
}