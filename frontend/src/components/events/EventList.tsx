import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, PencilFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import api from "../../api";
import { getName } from "../../methods/user";
import { Event, EventType } from "../../models";
import { describe_date } from "../../utils";
import { Button, Badge, EventHeading, BadgeColor } from "../base/Base";
import ClydeMarkdown from "../base/ClydeMarkdown";
import { useAuth } from "../Layout";
import AttendeeList from "./AttendeeList";
import AttendPopup, { PopupStep } from "./AttendPopup";
import CalendarDate, { CalendarTime } from "./CalendarDate";

interface EventListProps {
  eventRef: ((node: any) => void) | null,
  event: Event,
}

export const eventTypeMap: Record<EventType, [string, BadgeColor] > = {
  'SD': ['Summer Day Walk', "green"],
  'SW': ['Summer Weekend', "darkgreen"],
  'WD': ['Winter Day Walk', "blue"],
  'WW': ['Winter Weekend', "darkblue"],
  'CL': ['Climbing', "purple"],
  'SO': ['Social', "orange"],
  'XX': ['Other', "pink"],
}

// The default height before expansion
const DEFAULT_HEIGHT = 300;

export default function EventList({ event: initialEvent, eventRef }: EventListProps) {
  const [event, setEvent] = useState<Event>(initialEvent);
  const [attendPopupVisible, setAttendPopupVisible] = useState(false);
  const [attendPopupSteps, setAttendPopupSteps] = useState<Array<PopupStep>>([]);
  const [expandedAttendees, setExpandedAttendees] = useState(false);
  const [expandedWaitList, setExpandedWaitList] = useState(false);
  const [expanded, setExpanded] = useState<boolean | null>(false);
  const expandedHeightRef = useRef<HTMLDivElement>(null);


  const { currentUser } = useAuth();
  const isAttending = useMemo(() => (
    currentUser && event.attendees.map(user => user.id).includes(currentUser.id)
  ), [event, currentUser])

  const attendingList = useMemo(() => event.attendees.filter(user => !user.is_waiting_list), [event])
  const waitingList = useMemo(() => event.attendees.filter(user => user.is_waiting_list), [event])


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

  const handleAttend = useCallback(() => {
    if (isAttending) {
      toggleCurrentAttendance();
    } else {
      // Setup the steps
      let steps = [];
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
        setAttendPopupSteps(steps as Array<PopupStep>);
        setAttendPopupVisible(true);
      } else {
        toggleCurrentAttendance();
      }
    }
  }, [isAttending, toggleCurrentAttendance, setAttendPopupVisible, currentUser, event.show_popup])

  const todayDate = new Date();
  todayDate.setHours(0,0,0,0);
  const isInPast = new Date(event.event_date) < todayDate;

  // Only has an effect once, which is if the element has enough content to require expansion it non-nulls it.
  useEffect(() => {
    if (expandedHeightRef.current) {
      let wantedHeight = expandedHeightRef.current.scrollHeight;

      if (wantedHeight <= DEFAULT_HEIGHT) {
        setExpanded(null);
      }
    }
  }, []);

  // Sets appropriate height
  // Needs to be triggered every time to account for attendee list changes, etc.
  useEffect(() => {
    if (expandedHeightRef.current) {
      let wantedHeight = expandedHeightRef.current.scrollHeight;
      if (expanded === false) {
        expandedHeightRef.current.style.maxHeight = DEFAULT_HEIGHT.toString() + "px";
      } else {
        expandedHeightRef.current.style.maxHeight = wantedHeight.toString() + "px";
      }
    }
  });

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
              </div>
              {currentUser?.is_committee && (
                <Link to={`../${event.id}/edit`}><PencilFill className="text-sm ml-2 inline" /></Link>
              )}
            </div>
            <h6 className="text-[0.6rem] md:text-xs text-gray-400">Created by {getName(event.organiser)}. {describe_date(event.created_date)}</h6>
            <CalendarTime dateStr={event.event_date} />
          </div>
        </div>
        <div ref={expandedHeightRef} className="w-full mt-2 transition-[max-height] overflow-clip"> 
          <div className={(expanded === false ? "overflow-clip bg-gradient-to-b text-transparent bg-clip-text from-black to-gray-200" : "")}>
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
              <Button onClick={handleAttend}>
                {isAttending 
                  ? "Leave" 
                  : (
                    event.max_attendees && event.max_attendees > 0 && attendingList.length >= event.max_attendees ? "Join Waiting List" : "Attend"
                  )
                }
              </Button>
            </div>
          </div>
        </div>
      </div>
      {expanded !== null && (
        <div className="w-full h-6 bg-gradient-to-t from-gray-100 hover:from-gray-200" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp className="mx-auto" /> : <ChevronDown className="mx-auto" />}
        </div>
      )}
      </div>
    {attendPopupVisible && <AttendPopup steps={attendPopupSteps} toggleCurrentAttendance={toggleCurrentAttendance} setVisible={setAttendPopupVisible} />}
    </>
  )
}
