import React, { useCallback, useMemo, useState } from "react";
import { ArrowDown, ArrowUp } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import tw from "twin.macro";
import api from "../../api";
import { getName } from "../../methods/user";
import { Event } from "../../models";
import { describe_date } from "../../utils";
import { useAuth } from "../Layout";
import AttendeeList from "./AttendeeList";
import CalendarDate from "./CalendarDate";

interface EventListProps {
  eventRef: ((node: any) => void) | null,
  event: Event,
}

export default function EventList({ event: initialEvent, eventRef }: EventListProps) {
  const [event, setEvent] = useState<Event>(initialEvent);
  const [expandedAttendees, setExpandedAttendees] = useState(false);

  const { currentUser } = useAuth();
  const isAttending = useMemo(() => (
    currentUser && event.attendees.map(user => user.id).includes(currentUser.id)
  ), [event, currentUser])

  const toggleAttendance = useCallback(() => {
    api.patch(`events/${event.id}/attend/`).then(res => setEvent(res.data)) 
  }, [event])

  const isInPast = new Date(event.event_date) < new Date();

  return (
    <div ref={eventRef} className={"w-full shadow p-4 md:flex my-4 bg-gradient-to-r" + (isInPast ? " striped-gradient" : "")}>
      <CalendarDate dateStr={event.event_date}/>
      <div className="w-full">
        <h1 className="text-lg font-semibold tracking-tight">
          <span className="hover:underline"><Link to={`../${event.id}`}>{event.title}</Link></span>
        </h1>
        <h6 className="text-xs text-gray-400 mb-3">Created by {getName(event.organiser)}. {describe_date(event.created_date)}</h6>
        <p className={`text-sm whitespace-pre-line truncate`}>{event.description}</p>
        <div className="mt-4">
          <div className="flex">
            <h2>Attendees ({event.attendees.length} total)</h2>
            <button onClick={() => setExpandedAttendees(!expandedAttendees)} className="ml-3">
              {expandedAttendees ? <ArrowUp /> : <ArrowDown />}
            </button>
          </div>
          <div className="w-full my-2">
            {event.attendees.length > 0
              ? <AttendeeList attendees={event.attendees} expanded={expandedAttendees} />
              : <p className="text-gray-400 h-10">None yet!</p>
            }
          </div>
          <AttendButton onClick={toggleAttendance}>{isAttending ? "Leave" : "Attend"}</AttendButton>
        </div>
      </div>
    </div>
  )
}

const AttendButton = tw.button`px-2 py-1 rounded-lg bg-blue-400 text-gray-100 hover:bg-blue-600`