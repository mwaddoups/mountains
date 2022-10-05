import React, { useCallback, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, PencilFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import tw from "twin.macro";
import api from "../../api";
import { getName } from "../../methods/user";
import { Event } from "../../models";
import { describe_date } from "../../utils";
import ClydeMarkdown from "../ClydeMarkdown";
import { useAuth } from "../Layout";
import AttendeeList from "./AttendeeList";
import AttendPopup from "./AttendPopup";
import CalendarDate from "./CalendarDate";

interface EventListProps {
  eventRef: ((node: any) => void) | null,
  event: Event,
}

export default function EventList({ event: initialEvent, eventRef }: EventListProps) {
  const [event, setEvent] = useState<Event>(initialEvent);
  const [attendPopupVisible, setAttendPopupVisible] = useState(false);
  const [expandedAttendees, setExpandedAttendees] = useState(false);
  const [expandedWaitList, setExpandedWaitList] = useState(false);

  const { currentUser } = useAuth();
  const isAttending = useMemo(() => (
    currentUser && event.attendees.map(user => user.id).includes(currentUser.id)
  ), [event, currentUser])

  const attendingList = useMemo(() => event.attendees.filter(user => !user.is_waiting_list), [event])
  const waitingList = useMemo(() => event.attendees.filter(user => user.is_waiting_list), [event])

  const toggleAttendance = useCallback(() => {
    api.patch(`events/${event.id}/attend/`).then(res => setEvent(res.data)) 
  }, [event])

  const toggleWaitingList = useCallback(userId => {
    return () => {
      api.post(
        `events/${event.id}/changelist/`, { userId }
        ).then(res => setEvent(res.data)) 
    }
  }, [event])

  const handleAttend = useCallback(() => {
    if (isAttending || !event.show_popup) {
      toggleAttendance();
    } else {
      setAttendPopupVisible(true);
    }
  }, [isAttending, event, toggleAttendance, setAttendPopupVisible])

  const todayDate = new Date();
  todayDate.setHours(0,0,0,0);
  const isInPast = new Date(event.event_date) < todayDate;

  return (
    <>
    <div ref={eventRef} className={"w-full shadow p-4 md:flex mt-4 bg-gradient-to-r" + (isInPast ? " striped-gradient" : "")}>
      <CalendarDate dateStr={event.event_date}/>
      <div className="w-full">
        <div className="flex items-center">
          <h1 className={"text-lg font-semibold tracking-tight " + (isInPast ? "text-gray-500" : "text-teal-900")}>
            <span className="hover:underline"><Link to={`../${event.id}`}>{event.title}</Link></span>
          </h1>
          {currentUser?.is_committee && (
            <Link to={`../${event.id}/edit`}><PencilFill className="text-sm ml-2" /></Link>
          )}
        </div>
        <h6 className="text-xs text-gray-400 mb-3">Created by {getName(event.organiser)}. {describe_date(event.created_date)}</h6>
        <ClydeMarkdown>{event.description}</ClydeMarkdown>
        <div className="mt-4">
          <div className="flex">
            <h2>Attendees ({attendingList.length} total, {(event.max_attendees || 0) > 0 ? event.max_attendees : "no"} max)</h2>
            <button onClick={() => setExpandedAttendees(!expandedAttendees)} className="ml-3">
              {expandedAttendees ? <ArrowUp /> : <ArrowDown />}
            </button>
          </div>
          <div className="w-full my-2">
            {attendingList.length > 0
              ? <AttendeeList attendees={attendingList} expanded={expandedAttendees} toggleWaitingList={toggleWaitingList}/>
              : <p className="text-gray-400 h-10">None yet!</p>
            }
          </div>
          {waitingList.length > 0 && (
            <>
              <div className="flex">
                <h2>Waiting List ({waitingList.length} total)</h2>
                <button onClick={() => setExpandedWaitList(!expandedWaitList)} className="ml-3">
                  {expandedWaitList ? <ArrowUp /> : <ArrowDown />}
                </button>
              </div>
              <div className="w-full my-2">
                <AttendeeList attendees={waitingList} expanded={expandedWaitList} toggleWaitingList={toggleWaitingList}/>
              </div>
            </>
          )}
          <AttendButton onClick={handleAttend}>
            {isAttending 
              ? "Leave" 
              : (
                event.max_attendees && event.max_attendees > 0 && attendingList.length >= event.max_attendees ? "Join Waiting List" : "Attend"
              )
            }
          </AttendButton>
        </div>
      </div>
    </div>
    {attendPopupVisible && <AttendPopup toggleAttendance={toggleAttendance} setVisible={setAttendPopupVisible} />}
    </>
  )
}

const AttendButton = tw.button`px-2 py-1 rounded-lg bg-blue-400 text-gray-100 hover:bg-blue-600`