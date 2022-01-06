import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./Layout";

export default function ProfileEditor() {
  const { currentUser, setCurrentUser } = useAuth();
  const [firstName, setFirstName] = useState<string>(currentUser ? currentUser.first_name : '');
  const [surname, setSurname] = useState<string>(currentUser ? currentUser.last_name : '');
  const [about, setAbout] = useState<string>(currentUser ? currentUser.about : '');
  
  const approved = currentUser?.is_approved;

  const labelStyles = "block text-gray-700 text-sm font-bold mb-2"
  const inputStyles = "px-2 py-1 shadow border rounded w-full leading-tight focus:shadow-outline mb-4" 

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md roudned p-8 m-4">
      <h1 className="text-lg font-bold text-gray-700 tracking-wide">Edit Profile</h1>
      {(!approved) && <p className="text-red-500 text-sm italic">
        You must be approved to access the site. Please fill in the below
        form and you will receive an email when you have been approved.
      </p>}
      <form onSubmit={e => {
        e.preventDefault();
        console.log(e);
      }} className="mt-4">
        <label className={labelStyles} htmlFor="firstName">First Name</label>
        <input 
          className={inputStyles} type="string" id="firstName" 
          value={firstName} onChange={event => setFirstName(event.target.value)} />
        <label className={labelStyles} htmlFor="surname">Surname</label>
        <input 
          className={inputStyles} type="string" id="surname" 
          value={surname} onChange={event => setSurname(event.target.value)} />
        <label className={labelStyles} htmlFor="about">About</label>
        <textarea className={inputStyles + " resize-none h-80"} id="about" 
          value={about} onChange={event => setAbout(event.target.value)}/>
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