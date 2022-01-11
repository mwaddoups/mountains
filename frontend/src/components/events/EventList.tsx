import React, { useCallback, useState } from "react";
import { Calendar } from "react-bootstrap-icons";
import tw from "twin.macro";
import api from "../../api";
import { getName } from "../../methods/user";
import { Event } from "../../models";
import ProfilePicture from "../members/ProfilePicture";

interface EventListProps {
  event: Event;
}

export default function EventList({ event: initialEvent }: EventListProps) {
  const [event, setEvent] = useState<Event>(initialEvent);

  const toggleAttendance = useCallback(() => {
    api.patch(`events/${event.id}/attend/`).then(res => setEvent(res.data)) 
  }, [event])

  return (
    <div className={`w-full shadow p-4 flex transition-[height]`}>
      <Calendar className="h-20 w-32 mr-3" />
      <div>
        <h1 className="text-lg font-semibold tracking-tight">{event.title}</h1>
        <h6 className="text-xs text-gray-400 mb-3">Organized by {getName(event.organiser)}</h6>
        <p className={`text-sm whitespace-pre-line truncate`}>{event.description}</p>
        <div className="mt-4">
          <h2>Attendees</h2>
          <div className="flex my-2">
            {event.attendees.length > 0
              ? event.attendees.map(user => (
                <div className="w-10 h-10">
                  <ProfilePicture imageUrl = {user.profile_picture} />
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