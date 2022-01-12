import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import tw from "twin.macro";
import api from "../../api";
import { getName } from "../../methods/user";
import { Event } from "../../models";
import { describe_date } from "../../utils";
import ProfilePicture from "../members/ProfilePicture";
import CalendarDate from "./CalendarDate";

interface EventListProps {
  event: Event;
}

export default function EventList({ event: initialEvent }: EventListProps) {
  const [event, setEvent] = useState<Event>(initialEvent);

  const toggleAttendance = useCallback(() => {
    api.patch(`events/${event.id}/attend/`).then(res => setEvent(res.data)) 
  }, [event])

  return (
    <div className="w-full shadow p-4 flex">
      <CalendarDate dateStr={event.event_date}/>
      <div>
        <h1 className="text-lg font-semibold tracking-tight">{event.title}</h1>
        <h6 className="text-xs text-gray-400 mb-3">Created by {getName(event.organiser)}. {describe_date(event.created_date)}</h6>
        <p className={`text-sm whitespace-pre-line truncate`}>{event.description}</p>
        <div className="mt-4">
          <h2>Attendees</h2>
          <div className="flex flex-wrap w-full my-2">
            {event.attendees.length > 0
              ? event.attendees.map(user => (
                <div className="w-10 h-10 mr-1" key={user.id}>
                  <Link to={`../members/${user.id}`}>
                    <ProfilePicture imageUrl={user.profile_picture} />
                  </Link>
                </div>
              ))
              : <p className="text-gray-400 h-10">None yet!</p>
            }
          </div>
          <AttendButton onClick={toggleAttendance}>Attend</AttendButton>
        </div>
      </div>
    </div>
  )
}

const AttendButton = tw.button`px-2 py-1 rounded-lg bg-blue-400 text-gray-100 hover:bg-blue-600`
