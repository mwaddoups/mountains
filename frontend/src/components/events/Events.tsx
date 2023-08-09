import React, { useCallback, useEffect, useRef, useState } from "react";
import { XCircle } from "react-bootstrap-icons";
import { Link, useParams } from "react-router-dom";
import api from "../../api";
import { Event, EventType } from "../../models";
import { FilterBadge, SmallHeading } from "../base/Base";
import { useAuth } from "../Layout";
import Loading from "../Loading";
import EventList, { eventTypeMap } from "./EventList";

export default function Events() {
  const [eventList, setEventList] = useState<Array<Event>>([])
  const [selectedFilter, setSelectedFilter] = useState<EventType | null>(null)
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
        <EventFilter selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />
        {eventList
          .filter(e => new Date(e.event_date) >= todayDate)
          .filter(e => selectedFilter === null || e.event_type == selectedFilter)
          .sort((e1, e2) => new Date(e1.event_date).getTime() - new Date(e2.event_date).getTime())
          .map(eventDisplay)
        }
        <h1 className="text-xl md:text-3xl font-medium mb-2">Past Events</h1>
        {eventList
          .filter(e => new Date(e.event_date) < todayDate)
          .filter(e => selectedFilter === null || e.event_type == selectedFilter)
          .sort((e1, e2) => new Date(e2.event_date).getTime() - new Date(e1.event_date).getTime())
          .map(eventDisplay)
        }
        <p>Events older than 90 days are not shown.</p>
      </div>
    </Loading>
  )
}

interface EventFilterProps {
  selectedFilter: EventType | null,
  setSelectedFilter: (a: EventType | null) => void,
}

function EventFilter({ selectedFilter, setSelectedFilter }: EventFilterProps) {
  let allFilters = Object.keys(eventTypeMap) as Array<EventType>

  let handleClick = useCallback(e => {
    const wanted_type = e.target.id;
    setSelectedFilter(wanted_type);
  }, [selectedFilter, setSelectedFilter])
  
  const filterBarRef = useRef<HTMLDivElement>(null);
  const leftFadeClass = "before:pointer-events-none before:ease-in-out before:opacity-0 before:transition-opacity before:content-[''] before:h-full before:absolute before:left-0 before:top-0 before:w-1/6 before:bg-gradient-to-r before:from-white"
  const rightFadeClass = "after:pointer-events-none after:ease-in-out after:opacity-0 after:transition-opacity after:content-[''] after:h-full after:absolute after:right-0 after:top-0 after:w-1/6 after:bg-gradient-to-l after:from-white"
 
  const [filterContainerClassList, setFilterContainerClassList] = useState('');
  
  useEffect(() => {
    if(filterBarRef.current != null) {
      setFilterContainerClassList(getScrollClasses())
    }
  },[])

  const getScrollClasses = () => {
    const filterBar = filterBarRef.current!;
    let classList = ""

    if(filterBar.scrollWidth > filterBar.clientWidth) {
      if(filterBar.scrollLeft) {
        classList += " before:opacity-100";
      }

      const scrolledTo = filterBar.scrollLeft + filterBar.clientWidth
      if(scrolledTo +5 < filterBar.scrollWidth) {
        classList += " after:opacity-100";
      }
    }
    return classList
  }

  const onScrollFilters = () => {
    setFilterContainerClassList(getScrollClasses())
  }

  return (
    <div className="rounded shadow p-4">
      <div className="flex">
        <SmallHeading className="inline mr-4">Filter Event Types</SmallHeading>
      </div>
      <div className={`relative ${leftFadeClass} ${rightFadeClass} ${filterContainerClassList}`}>
        <div ref={filterBarRef} onScroll={onScrollFilters} className={`py-1 flex overflow-auto items-center`}>
          {allFilters.filter(event_type => selectedFilter == null ||event_type == selectedFilter).map((event_type, index) => (
            <FilterBadge
              key={event_type}
              $badgeColor={eventTypeMap[event_type][1]} 
              className={"py-0.5"}
              onClick={handleClick} id={event_type}>
                {eventTypeMap[event_type][0]}
            </FilterBadge>
          ))}
          {selectedFilter !== null && <XCircle onClick={()=>setSelectedFilter(null)} className="ml-2 text-red-600 cursor-pointer text-2xl"></XCircle>}
        </div>
      </div>
    </div>
  )
}