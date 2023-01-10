import React, { useCallback, useState } from "react";
import DateTimePicker from "react-datetime-picker";
import { Link, Navigate } from "react-router-dom";
import api from "../../api";
import { FormButton, FormCancelButton, FormInput, FormLabel } from "../base/Base";


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
        <FormButton
          type="submit">
            Submit
        </FormButton>
        <Link to="..">
          <FormCancelButton className="ml-auto">Cancel</FormCancelButton>
        </Link>
      </div>
    </form>
  )
}