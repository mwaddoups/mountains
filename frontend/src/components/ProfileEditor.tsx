import React, { useState, useCallback, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "./Layout";

export default function ProfileEditor() {
  const {currentUser, refreshUser} = useAuth();
  const [firstName, setFirstName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [about, setAbout] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false)


  // The current user shouldnt change while editing - this handles
  // making sure we update it when it does change.
  useEffect(() => {
    setFirstName(currentUser ? currentUser.first_name : '')
    setSurname(currentUser ? currentUser.last_name : '')
    setAbout(currentUser ? currentUser.about : '')
  }, [currentUser])
  
  const approved = currentUser?.is_approved;

  const updateUser = useCallback(event => {
    event.preventDefault();
    if (currentUser) {
      let newUser = Object.assign({}, currentUser);
      newUser.first_name = firstName
      newUser.last_name = surname
      newUser.about = about

      api.put(`users/${currentUser.id}/`, newUser).then(res => {
        refreshUser();
        setSubmitted(true);
      })
    }
  }, [about, currentUser, firstName, refreshUser, surname])

  const labelStyles = "block text-gray-700 text-sm font-bold mb-2"
  const inputStyles = "px-2 py-1 shadow border rounded w-full leading-tight focus:shadow-outline mb-4" 

  if (currentUser && submitted) {
    return <Navigate to={`../${currentUser.id}`} />
  }

  return (
    <div className="w-3/4 mx-auto bg-white shadow-md roudned p-8 m-4">
      <h1 className="text-lg font-bold text-gray-700 tracking-wide">Edit Profile</h1>
      {(!approved) && <p className="text-red-500 text-sm italic">
        You must be approved to access the site. Please fill in the below
        form and you will receive an email when you have been approved.
      </p>}
      <form onSubmit={updateUser} className="mt-4">
        <label className={labelStyles} htmlFor="firstName">First Name</label>
        <input 
          className={inputStyles} type="string" id="firstName" 
          value={firstName} onChange={event => setFirstName(event.target.value)} />
        <label className={labelStyles} htmlFor="surname">Surname</label>
        <input 
          className={inputStyles} type="string" id="surname" 
          value={surname} onChange={event => setSurname(event.target.value)} />
        <label className={labelStyles} htmlFor="about">About</label>
        <p className="text-sm text-gray-700 italic mb-2 ml-2">
          Write about yourself and what brings you to our club! This will be public 
          once you are approved, but you can change it later on.
        </p>
        <textarea className={inputStyles + " resize-none h-80"} id="about" 
          value={about} onChange={event => setAbout(event.target.value)} />
        <div className="flex justify-between">
          <button
            className="block rounded bg-blue-500 hover:bg-blue-700 text-white font-bold p-3"
            type="submit">
              {approved ? "Update" : "Submit for verification"}
          </button>
          <Link to=".">
            <button className="ml-auto block rounded bg-gray-300 hover:bg-gray-400 text-gray-700 p-3">Cancel</button>
          </Link>
        </div>
      </form>
    </div>
  )
}