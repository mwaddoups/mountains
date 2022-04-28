import React, { useState, useCallback, useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import api from "../../api";
import { Event } from "../../models";
import DateTimePicker from 'react-datetime-picker';
import dateFormat from "dateformat";
import Loading from "../Loading";

export default function EventEditor() {
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [eventDate, setEventDate] = useState<Date>(new Date());
  const [showPopup, setShowPopup] = useState<boolean>(true);

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
    if (!currentEvent) {
      newEvent.max_attendees = 0; // TODO: Allow maximum
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
  }, [title, description, eventDate, currentEvent, showPopup, eventId])

  const labelStyles = "block text-gray-700 text-sm font-bold mb-2"
  const inputStyles = "text-sm px-2 py-1 shadow border rounded w-full leading-tight focus:shadow-outline mb-4" 

  if (submitted) {
    return <Navigate to={`..`} />
  }

  return (
    <Loading loading={loading}>
      <div className="w-3/4 mx-auto bg-white shadow-md roudned p-8 m-4">
        <h1 className="text-lg font-bold text-gray-700 tracking-wide">Edit Event</h1>
        <form onSubmit={updateEvent} className="mt-4">
          <div className="w-full">
            <label className={labelStyles} htmlFor="title">Title</label>
            <input 
              className={inputStyles} type="string" id="title" 
              value={title} onChange={event => setTitle(event.target.value)} />
          </div>
          <div>
            <label className={labelStyles}>Date</label>
            <DateTimePicker className="text-sm rounded shadow border mb-4" onChange={setEventDate} value={eventDate} />
          </div>
          <div className="flex items-center">
            <label className={labelStyles}>Show the participation popup before allowing attendance (usually yes for walks)?</label>
            <input className="ml-4" type="checkbox" checked={showPopup} onChange={() => setShowPopup(!showPopup)} />
          </div>
          <label className={labelStyles} htmlFor="description">Description</label>
          <textarea className={inputStyles + " resize-none h-80"} id="description" 
            value={description} onChange={event => setDescription(event.target.value)} />
          <div className="flex justify-between">
            <button
              className="block rounded bg-blue-500 hover:bg-blue-700 text-white font-bold p-3"
              type="submit">
                Submit
            </button>
            <Link to="..">
              <button className="ml-auto block rounded bg-gray-300 hover:bg-gray-400 text-gray-700 p-3">Cancel</button>
            </Link>
          </div>
        </form>
      </div>
    </Loading>
  )
}