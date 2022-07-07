import React, { useCallback, useState } from "react";
import DateTimePicker from "react-datetime-picker";
import { Link, Navigate } from "react-router-dom";
import api from "../../api";
import { FormInput, FormLabel } from "../Base";


export default function AlbumCreator() {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [name, setName] = useState("");

  const createAlbum = useCallback(e => {
    e.preventDefault();

    api.post(`albums/`, { name, event_date: eventDate }).then(res => setSubmitted(true))
  }, [name, eventDate])

  if (submitted) {
    return <Navigate to={`..`} />
  }

  return (
    <form className="w-3/4 mx-auto" onSubmit={createAlbum}>
      <FormLabel>Album Name</FormLabel>
      <FormInput value={name} onChange={e => setName(e.target.value)} />
      <FormLabel>Event Date (leave blank if n/a)</FormLabel>
      <DateTimePicker 
        disableClock={true} 
        format="MMMM d, y"
        className="text-sm rounded shadow border w-full mb-4" onChange={setEventDate} value={eventDate} />
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
  )
}