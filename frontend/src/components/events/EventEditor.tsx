import React, { useState, useCallback, useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import api from "../../api";
import { Event, EventType } from "../../models";
import DateTimePicker from 'react-datetime-picker';
import dateFormat from "dateformat";
import Loading from "../Loading";
import { FormButton, FormCancelButton, FormContainer, FormInput, FormLabel, FormTextArea, SubHeading, Error, FormSelect } from "../base/Base";
import { eventTypeMap } from "./EventList";

import summerWalkURL from "./templates/SummerWalk.md";
import summerWeekendURL from "./templates/SummerWeekend.md";
import winterWalkURL from "./templates/WinterWalk.md";
import winterWeekendURL from "./templates/WinterWeekend.md";
import climbingURL from "./templates/Climbing.md";

const descriptionTemplates: Partial<Record<EventType, string>> = {
  SD: summerWalkURL,
  SW: summerWeekendURL,
  WD: winterWalkURL,
  WW: winterWeekendURL,
  CL: climbingURL
};

interface EventEditorProps {
  copyFrom: boolean
}

export default function EventEditor({ copyFrom }: EventEditorProps) {
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [title, setTitle] = useState<string>('');
  const [eventId, setEventId] = useState<number | null>(null);
  const [eventType, setEventType] = useState<EventType | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const [descriptionEdited, setDescriptionEdited] = useState<boolean>(false);
  const [eventDate, setEventDate] = useState<Date>(new Date());
  const [eventSignupOpenDate, setEventSignupOpenDate] = useState<Date | undefined>(undefined);
  const [showPopup, setShowPopup] = useState<boolean>(true);
  const [membersOnly, setMembersOnly] = useState<boolean>(false);
  const [signupOpen, setSignupOpen] = useState<boolean>(true);
  const [maxAttendees, setMaxAttendees] = useState<number>(0); 

  // use params to check if we are at event/x/edit or event/new
  // If editing, reset the state first with the correct valeus
  const { eventId: eventIdParam } = useParams();

  useEffect(() => {
    if (eventIdParam) {
      api.get(`events/${eventIdParam}/`).then(res => {
        let event = (res.data as Event);
        // Check if we are at event/x/edit or event/x/copy
        // This is set by the routing
        if (!copyFrom) {
          setCurrentEvent(event);
          setEventId(event.id);
        }
        setTitle(event.title);
        setDescription(event.description);
        setDescriptionEdited(true)
        setEventDate(new Date(event.event_date));
        setShowPopup(event.show_popup);
        setMembersOnly(event.members_only);
        setMaxAttendees(event.max_attendees);
        setEventType(event.event_type);
        setSignupOpen(event.signup_open);
        if (event.signup_open_date !== null) {
          setEventSignupOpenDate(new Date(event.signup_open_date))
        }
      })
    }
    setLoading(false);
  }, [eventIdParam, copyFrom])

  const updateEvent = useCallback(e => {
    e.preventDefault();
    let newEvent = Object.assign({}, currentEvent);

    newEvent.title = title;
    newEvent.description = description;
    newEvent.event_date = dateFormat(eventDate, "isoDateTime");
    newEvent.show_popup = showPopup;
    newEvent.members_only = membersOnly;
    newEvent.signup_open = signupOpen;
    if (eventSignupOpenDate !== undefined) {
      newEvent.signup_open_date = dateFormat(eventSignupOpenDate, "isoDateTime");
    } else {
      newEvent.signup_open_date = null
    }
    newEvent.max_attendees = maxAttendees || 0;
    if (!currentEvent) {
      newEvent.attendees = [];
    }

    if (!eventType) {
      setErrorText("Please select an event type before submission!")
      return
    }
    newEvent.event_type = eventType;

    if (eventId) {
      setErrorText(null);
      api.put(`events/${eventId}/`, newEvent).then(res => {
        setSubmitted(true);
      })
    } else {
      setErrorText(null);
      api.post(`events/`, newEvent).then(res => {
        setEventId((res.data as Event).id);
        setSubmitted(true);
      })
    }
  }, [title, description, eventDate, currentEvent, showPopup, eventId, eventType, maxAttendees, membersOnly, signupOpen, eventSignupOpenDate])

  const setNewEventType = useCallback((newEventType: EventType) => {
    if (Object.keys(eventTypeMap).includes(newEventType)) {
      setEventType(newEventType as EventType);
      if ((newEventType === 'CL') || (newEventType === 'SO')) {
        // Don't show popup by default for climbing/social
        setShowPopup(false);
      } else {
        setShowPopup(true);
      }

      if ((newEventType === 'SW') || (newEventType === 'WW')) {
        // Weekend trips are members only by default
        setMembersOnly(true);
      } else {
        setMembersOnly(false);
      }
    }

    if (!descriptionEdited) {
      let templateURL = descriptionTemplates[newEventType]
      if (templateURL) {
        fetch(templateURL).then(
          res => res.text().then(
            text => setDescription(text)
        ))
      } else {
        setDescription('')
      }
    }
  }, [setEventType, setShowPopup, descriptionEdited])

  if (submitted) {
    return <Navigate to={`../${eventId}`} />
  }

  return (
    <Loading loading={loading}>
      <FormContainer>
        <SubHeading>Edit Event</SubHeading>
        <form onSubmit={updateEvent}>
          <div className="w-full">
            <FormLabel htmlFor="title">Title</FormLabel>
            <FormInput 
              type="string" id="title" 
              value={title} onChange={event => setTitle(event.target.value)} />
          </div>
          <div>
            <FormLabel>Date</FormLabel>
            <DateTimePicker className="text-sm rounded shadow border mb-4" 
              onChange={setEventDate} value={eventDate} format="dd/MM/y h:mm a"/>
          </div>
          <div className="w-full">
            <FormLabel htmlFor="eventtype">Event Type</FormLabel>
            <FormSelect id="eventtype" value={eventType ? eventType : ""} 
              onChange={event => setNewEventType(event.target.value as EventType)}>
                <option value=""></option>
                {Object.entries(eventTypeMap).map(([eventType, [eventTypeLabel, _]]) => (
                  <option key={eventType} value={eventType}>{eventTypeLabel}</option>)
                )}
            </FormSelect>
          </div>
          <div className="flex items-center">
            <FormLabel>Show the participation statement before allowing attendance (usually yes for walks, no for socials/climbing)?</FormLabel>
            <input className="-ml-1 md:ml-4" type="checkbox" checked={showPopup} onChange={() => setShowPopup(!showPopup)} />
          </div>
          <div className="flex items-center">
            <FormLabel>Make this event members only? (Usually no, unless weekend)</FormLabel>
            <input className="-ml-1 md:ml-4" type="checkbox" checked={membersOnly} onChange={() => setMembersOnly(!membersOnly)} />
          </div>
          <div className="flex items-center">
            <FormLabel>Open signup for this event? (Usually yes)</FormLabel>
            <input className="-ml-1 md:ml-4" type="checkbox" checked={signupOpen} onChange={() => setSignupOpen(!signupOpen)} />
          </div>
          <div>
            <FormLabel>Event Open Date (leave blank for always open)</FormLabel>
            <DateTimePicker className="text-sm rounded shadow border mb-4" onChange={setEventSignupOpenDate} value={eventSignupOpenDate} format="dd/MM/y h:mm a"/>
          </div>
          <div className="w-full">
            <FormLabel htmlFor="maxAttendees">Max Attendees (0 = no max)</FormLabel>
            <FormInput 
              type="number" id="maxAttendees" 
              value={maxAttendees || 0} onChange={event => setMaxAttendees(+event.target.value)} />
          </div>
          <FormLabel htmlFor="description">Description</FormLabel>
          <FormTextArea id="description" 
            value={description} onChange={event => {
              setDescription(event.target.value)
              setDescriptionEdited(true)
            }} />
          {errorText && <Error>{errorText}</Error>}
          <div className="flex justify-between">
            <FormButton
              type="submit">
                Submit
            </FormButton>
            <Link to={`../${eventId ? eventId : '' }`}>
              <FormCancelButton className="ml-auto">Cancel</FormCancelButton>
            </Link>
          </div>
        </form>
      </FormContainer>
    </Loading>
  )
}