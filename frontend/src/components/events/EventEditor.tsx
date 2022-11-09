import React, { useState, useCallback, useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import api from "../../api";
import { Event } from "../../models";
import DateTimePicker from 'react-datetime-picker';
import dateFormat from "dateformat";
import Loading from "../Loading";
import { FormButton, FormCancelButton, FormContainer, FormInput, FormLabel, FormTextArea, SubHeading } from "../base/Base";

export default function EventEditor() {
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [eventDate, setEventDate] = useState<Date>(new Date());
  const [showPopup, setShowPopup] = useState<boolean>(true);
  const [maxAttendees, setMaxAttendees] = useState<number>(0); 

  // use params to check if we are at event/x/edit or event/new
  // If editing, reset the state first with the correct valeus
  const { eventId } = useParams();

  useEffect(() => {
    if (eventId) {
      api.get(`events/${eventId}/`).then(res => {
        let event = (res.data as Event);
        setCurrentEvent(event);
        setTitle(event.title);
        setDescription(event.description);
        setEventDate(new Date(event.event_date));
        setShowPopup(event.show_popup);
        setMaxAttendees(event.max_attendees);
      })
    }
    setLoading(false);
  }, [eventId])

  const updateEvent = useCallback(e => {
    e.preventDefault();
    let newEvent = Object.assign({}, currentEvent);

    newEvent.title = title;
    newEvent.description = description;
    newEvent.event_date = dateFormat(eventDate, "isoDateTime");
    newEvent.show_popup = showPopup;
    newEvent.max_attendees = maxAttendees || 0;
    if (!currentEvent) {
      newEvent.attendees = [];
    }

    if (eventId) {
      api.put(`events/${eventId}/`, newEvent).then(res => {
        setSubmitted(true);
      })
    } else {
      api.post(`events/`, newEvent).then(res => {
        setSubmitted(true);
      })
    }
  }, [title, description, eventDate, currentEvent, showPopup, eventId, maxAttendees])

  if (submitted) {
    return <Navigate to={`..`} />
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
            <DateTimePicker className="text-sm rounded shadow border mb-4" onChange={setEventDate} value={eventDate} format="dd/MM/y h:mm a"/>
          </div>
          <div className="flex items-center">
            <FormLabel>Show the participation popup before allowing attendance (usually yes for walks)?</FormLabel>
            <input className="ml-4" type="checkbox" checked={showPopup} onChange={() => setShowPopup(!showPopup)} />
          </div>
          <div className="w-full">
            <FormLabel htmlFor="maxAttendees">Max Attendees (0 = no max)</FormLabel>
            <FormInput 
              type="number" id="maxAttendees" 
              value={maxAttendees || 0} onChange={event => setMaxAttendees(+event.target.value)} />
          </div>
          <FormLabel htmlFor="description">Description</FormLabel>
          <FormTextArea id="description" 
            value={description} onChange={event => setDescription(event.target.value)} />
          <div className="flex justify-between">
            <FormButton
              className="block rounded bg-blue-500 hover:bg-blue-700 text-white font-bold p-3"
              type="submit">
                Submit
            </FormButton>
            <Link to="..">
              <FormCancelButton className="ml-auto">Cancel</FormCancelButton>
            </Link>
          </div>
        </form>
      </FormContainer>
    </Loading>
  )
}