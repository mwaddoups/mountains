import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api";
import { Event, EventType } from "../../models";
import { Button, FilterBadge, SmallHeading } from "../base/Base";
import { useAuth } from "../Layout";
import Loading from "../Loading";
import EventList, { eventTypeMap } from "./EventList";
import dateFormat from "dateformat";
import { DebounceInput } from "react-debounce-input";

const LIMIT_SIZE = 10;

export default function Events() {
  const [eventList, setEventList] = useState<Array<Event>>([]);
  const [eventSearch, setEventSearch] = useState<string>("");
  const [filters, setFilters] = useState<Array<EventType>>(
    Object.keys(eventTypeMap).filter((e) => e !== "CM") as Array<EventType>
  );
  const [isLoading, setIsLoading] = useState(true);
  const [lastOffset, setlastOffset] = useState(0);

  // Slightly complex logic needed to get the selectedEvent from the param
  const [selectedEvent, setSelectedEvent] = useState<HTMLDivElement | null>(
    null
  );

  const { eventId } = useParams();

  const { currentUser } = useAuth();
  const selectedEventRef = useCallback(
    (node) => {
      if (node !== null) {
        setSelectedEvent(node);
      }
    },
    [setSelectedEvent]
  );

  const loadMoreEvents = useCallback(
    (e) => {
      setIsLoading(true);
      api
        .get(`events/?limit=${LIMIT_SIZE}&offset=${lastOffset}`)
        .then((response) => {
          setEventList(eventList.concat(response.data["results"]));
          setlastOffset(response.data["last_offset"]);
          setIsLoading(false);
        });
    },
    [eventList, lastOffset]
  );

  useEffect(() => {
    if (eventList.length === 0) {
      if (eventId) {
        // Load events up to that selected id, on server side
        setIsLoading(true);
        api.get(`events/?selectedId=${eventId}`).then((response) => {
          setEventList(eventList.concat(response.data["results"]));
          setlastOffset(response.data["last_offset"]);
          setIsLoading(false);
        });
      } else {
        // Calling with no params loads just future events
        setIsLoading(true);
        api.get(`events/`).then((response) => {
          setEventList(eventList.concat(response.data["results"]));
          setlastOffset(response.data["last_offset"]);
          setIsLoading(false);
        });
      }
    }
  }, [eventList, loadMoreEvents, eventId]);

  useEffect(() => {
    selectedEvent?.scrollIntoView();
  }, [selectedEvent]);

  const eventDisplay = useCallback(
    (event) => (
      <EventList
        key={event.id}
        event={event}
        eventRef={event.id.toString() === eventId ? selectedEventRef : null}
      />
    ),
    [eventId, selectedEventRef]
  );

  const todayDate = useMemo(() => {
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    return todayDate;
  }, []);

  const filteredEvents = useMemo(
    () =>
      eventList
        .filter((e) =>
          e.title.toLowerCase().includes(eventSearch.toLowerCase())
        )
        .filter((e) => filters.includes(e.event_type)),
    [eventList, eventSearch, filters]
  );

  const pastEvents = filteredEvents.filter(
    (e) => new Date(e.event_date) < todayDate
  );

  const hasPastEvent =
    eventList.find((e) => new Date(e.event_date) < todayDate) !== undefined;

  return (
    <Loading loading={isLoading}>
      <div>
        <div className="flex">
          <h1 className="text-xl md:text-3xl font-medium mb-2">
            Upcoming Events
          </h1>
          {(currentUser?.is_site_admin || currentUser?.is_walk_coordinator) && (
            <Link to="../new">
              <button className="ml-4 rounded bg-blue-500 hover:bg-blue-700 text-white text-sm p-2">
                Create event
              </button>
            </Link>
          )}
        </div>
        <EventFilter filters={filters} setFilters={setFilters} />
        <form className="flex">
          <DebounceInput
            className="font-light px-2 py-1 shadow border rounded w-full leading-tight focus:shadow-lg mb-4"
            type="search"
            placeholder="Search for event..."
            value={eventSearch}
            onChange={(event) => setEventSearch(event.target.value)}
          />
        </form>
        {filteredEvents
          .filter((e) => new Date(e.event_date) >= todayDate)
          .map(eventDisplay)}
        {pastEvents.length > 0 && (
          <>
            <h1 className="text-xl md:text-3xl font-medium mb-2">
              Past Events
            </h1>
            {pastEvents.map(eventDisplay)}
          </>
        )}
        {eventList.length > 0 && (
          <Button onClick={loadMoreEvents} className="w-full">
            Load more events (
            {!hasPastEvent
              ? `up to ${dateFormat(
                  eventList[eventList.length - 1].event_date,
                  "mmmm dS, yyyy"
                )} so far`
              : `back to ${dateFormat(
                  eventList[eventList.length - 1].event_date,
                  "mmmm dS, yyyy"
                )} so far`}
            )
          </Button>
        )}
      </div>
    </Loading>
  );
}

interface EventFilterProps {
  filters: Array<EventType>;
  setFilters: (a: Array<EventType>) => void;
}

function EventFilter({ filters, setFilters }: EventFilterProps) {
  let allFilters = Object.keys(eventTypeMap) as Array<EventType>;
  let [firstClick, setFirstClick] = useState(true);
  let [fadeLeft, setFadeLeft] = useState(false);
  let [fadeRight, setFadeRight] = useState(false);

  const scrollableDivRef = useRef<HTMLDivElement>(null);

  let handleClick = useCallback(
    (e) => {
      let wanted_type = e.target.id;
      if (firstClick) {
        // First click we only select that type
        setFirstClick(false);
        setFilters([wanted_type]);
      } else if (filters.includes(wanted_type)) {
        setFilters(filters.filter((e) => e !== wanted_type));
      } else {
        setFilters(filters.concat([wanted_type]));
      }
    },
    [filters, setFilters, firstClick]
  );

  let selectAll = useCallback(
    (e) => {
      setFilters(allFilters);
    },
    [setFilters, allFilters]
  );

  useEffect(() => {
    // If the element is overflowing, add the right fade
    if (scrollableDivRef.current) {
      const div = scrollableDivRef.current;
      if (div.clientWidth < div.scrollWidth) {
        setFadeRight(true);
      }
    }
  }, []);

  let handleScroll = useCallback((e) => {
    if (scrollableDivRef.current) {
      const div = scrollableDivRef.current;
      const isAtLeftEdge = div.scrollLeft === 0;
      const isAtRightEdge =
        div.scrollLeft === div.scrollWidth - div.clientWidth;

      if (isAtLeftEdge) {
        setFadeLeft(false);
      } else {
        setFadeLeft(true);
      }

      if (isAtRightEdge) {
        setFadeRight(false);
      } else {
        setFadeRight(true);
      }
    }
  }, []);

  return (
    <div className="rounded shadow p-4">
      <SmallHeading className="inline mr-4">Filter Event Types</SmallHeading>
      <FilterBadge $badgeColor="gray" onClick={selectAll}>
        Select All
      </FilterBadge>
      <div className="relative">
        <div
          className="py-1 flex overflow-auto relative"
          ref={scrollableDivRef}
          onScroll={handleScroll}
        >
          {allFilters.map((event_type) => (
            <FilterBadge
              key={event_type}
              $badgeColor={eventTypeMap[event_type][1]}
              className={
                "py-0.5" +
                (filters.includes(event_type) ? " opacity-100" : " opacity-50")
              }
              onClick={handleClick}
              id={event_type}
            >
              {eventTypeMap[event_type][0]}
            </FilterBadge>
          ))}
        </div>
        {fadeLeft && (
          <div className="absolute inset-0 bg-gradient-to-r from-white w-1/6 h-full"></div>
        )}
        {fadeRight && (
          <div className="absolute top-0 right-0 bg-gradient-to-l from-white w-1/6 h-full"></div>
        )}
      </div>
    </div>
  );
}
