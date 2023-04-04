import React, { useCallback, useMemo, useState } from "react";
import { ArrowClockwise, ArrowDown, ArrowUp, DoorClosedFill, DoorOpenFill, PencilFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import api from "../../api";
import { getName } from "../../methods/user";
import { Event, EventType } from "../../models";
import { describe_date } from "../../utils";
import { Button, Badge, EventHeading, BadgeColor, CancelButton } from "../base/Base";
import ClydeMarkdown from "../base/ClydeMarkdown";
import Expander from "../base/Expander";
import { useAuth } from "../Layout";
import AttendeeList from "./AttendeeList";
import AttendPopup, { PopupStep } from "./AttendPopup";
import CalendarDate, { CalendarTime } from "./CalendarDate";

interface EventListProps {
  eventRef: ((node: any) => void) | null,
  event: Event,
}

export const eventTypeMap: Record<EventType, [string, BadgeColor]> = {
  'SD': ['Summer Day Walk', "green"],
  'SW': ['Summer Weekend', "darkgreen"],
  'WD': ['Winter Day Walk', "blue"],
  'WW': ['Winter Weekend', "darkblue"],
  'CL': ['Climbing', "purple"],
  'SO': ['Social', "orange"],
  'XX': ['Other', "pink"],
}

export default function EventList({ event: initialEvent, eventRef }: EventListProps) {
  const [event, setEvent] = useState<Event>(initialEvent);
  const [attendPopupVisible, setAttendPopupVisible] = useState(false);
  const [attendPopupSteps, setAttendPopupSteps] = useState<Array<PopupStep>>([]);
  const [expandedAttendees, setExpandedAttendees] = useState(false);
  const [expandedWaitList, setExpandedWaitList] = useState(false);

  const { currentUser } = useAuth();
  const isAttending = useMemo(() => (
    currentUser && event.attendees.map(user => user.id).includes(currentUser.id)
  ), [event, currentUser])

  const attendingList = useMemo(() => event.attendees.filter(user => !user.is_waiting_list), [event])
  const waitingList = useMemo(() => event.attendees.filter(user => user.is_waiting_list), [event])

  const refreshEvent = useCallback(() => {
    api.get(`events/${event.id}/`).then(res => setEvent(res.data))
  }, [event])

  const toggleAttendance = useCallback((userId: number) => {
    return () => {
      api.post(`events/${event.id}/attend/`, { userId }).then(res => setEvent(res.data)) 
    }
  }, [event])

  const toggleCurrentAttendance = useCallback(() => {
    api.patch(`events/${event.id}/attend/`).then(res => setEvent(res.data)) 
  }, [event])

  const toggleWaitingList = useCallback(userId => {
    return () => {
      api.post(
        `events/${event.id}/changelist/`, { userId }
        ).then(res => setEvent(res.data)) 
    }
  }, [event])

  const toggleDriving = useCallback(userId => {
    return () => {
      api.post(
        `events/${event.id}/changedriving/`, { userId }
        ).then(res => setEvent(res.data)) 
    }
  }, [event])

  const toggleSignup = useCallback(() => {
      api.patch(
        `events/${event.id}/`, { signup_open: (!event.signup_open) }
        ).then(res => setEvent(res.data)) 
    }, [event])

  const handleAttend = useCallback(() => {
    if (isAttending) {
      toggleCurrentAttendance();
    } else {
      // Setup the steps
      let steps: Array<PopupStep> = [];
      if (currentUser && !currentUser.is_paid && event.members_only) {
        // If it's members only, 
        steps.push("members_only")
      }

      if (currentUser && !currentUser.is_on_discord) {
        steps.push("discord")
      }

      if (currentUser && event.show_popup) {
        // We just show this for any event which requires participation statement
        steps.push("ice")
      }
      if (event.show_popup) {
        steps.push("participation")
      }

      if (steps.length > 0) {
        setAttendPopupSteps(steps);
        setAttendPopupVisible(true);
      } else {
        toggleCurrentAttendance();
      }
    }
  }, [isAttending, toggleCurrentAttendance, setAttendPopupVisible, currentUser, event])

  const todayDate = new Date();
  todayDate.setHours(0,0,0,0);
  const isInPast = new Date(event.event_date) < todayDate;

  return (
    <>
    <div  
      ref={eventRef} 
      className={"w-full shadow" + (isInPast ? " striped-gradient" : "")}
      >
      <div className="w-full p-4 mt-4">
        <div className="flex">
          <CalendarDate dateStr={event.event_date}/>
          <div className="w-full">
            <div className="flex items-center">
              <div className="md:flex md:items-center">
                <EventHeading className={isInPast ? "text-gray-500" : "text-teal-900"}>
                  <Link to={`../${event.id}`}>{event.title}</Link>
                </EventHeading>
                <Badge className="md:ml-2" $badgeColor={eventTypeMap[event.event_type][1]}>{eventTypeMap[event.event_type][0]}</Badge>
                {event.members_only && <Badge className="truncate" $badgeColor="blue">Members Only</Badge>}
              </div>
              <button onClick={refreshEvent}><ArrowClockwise /></button>
              {(currentUser?.is_committee || currentUser?.is_walk_coordinator) && (<>
                <Link to={`../${event.id}/edit`}><PencilFill className="text-sm ml-2 inline" /></Link>
                <span onClick={toggleSignup} className="cursor-pointer">
                  {event.signup_open ? <DoorOpenFill className="text-green-500 text-sm ml-2 inline" /> : <DoorClosedFill className="text-red-500 text-sm ml-2 inline" />}
                </span>
              </>)}
            </div>
            <h6 className="text-[0.6rem] md:text-xs text-gray-400">Created by {getName(event.organiser)}. {describe_date(event.created_date)}</h6>
            <CalendarTime dateStr={event.event_date} />
          </div>
        </div>
        <div className="w-full mt-2"> 
          <Expander>
            <ClydeMarkdown>{event.description}</ClydeMarkdown>
          </Expander>
          <div className="mt-4">
            <div className="flex">
              <h2>Attendees ({attendingList.length} total, {(event.max_attendees || 0) > 0 ? event.max_attendees : "no"} max)</h2>
              <button onClick={() => setExpandedAttendees(!expandedAttendees)} className="ml-3">
                {expandedAttendees ? <ArrowUp /> : <ArrowDown />}
              </button>
            </div>
            <div className="w-full my-2">
              {attendingList.length > 0
                ? <AttendeeList attendees={attendingList} expanded={expandedAttendees} toggleWaitingList={toggleWaitingList} toggleAttendance={toggleAttendance} toggleDriving={toggleDriving}/>
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
                  <AttendeeList attendees={waitingList} expanded={expandedWaitList} toggleWaitingList={toggleWaitingList} toggleAttendance={toggleAttendance} toggleDriving={toggleDriving}/>
                </div>
              </>
            )}
            {event.signup_open 
               ? <Button onClick={handleAttend}>
                  {isAttending 
                    ? "Leave" 
                    : (
                      event.max_attendees && event.max_attendees > 0 && attendingList.length >= event.max_attendees ? "Join Waiting List" : "Attend"
                    )
                  }
                </Button>
               : <CancelButton>Signup closed</CancelButton>
            }
          </div>
        </div>
      </div>
    </div>
    {attendPopupVisible && <AttendPopup steps={attendPopupSteps} toggleCurrentAttendance={toggleCurrentAttendance} setVisible={setAttendPopupVisible} />}
    </>
  )
}
