import React, { useCallback, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import api from "../../api";
import { FormInput, FormLabel } from "../Base";


export default function AlbumCreator() {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [name, setName] = useState("");

  const createAlbum = useCallback(e => {
    e.preventDefault();

    api.post(`albums/`, { name }).then(res => setSubmitted(true))
  }, [name])

  if (submitted) {
    return <Navigate to={`..`} />
  }

  return (
    <form className="w-3/4 mx-auto" onSubmit={createAlbum}>
      <FormLabel>Album Name</FormLabel>
      <FormInput value={name} onChange={e => setName(e.target.value)} />
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