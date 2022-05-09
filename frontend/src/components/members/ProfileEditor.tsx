import React, { useState, useCallback, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../Layout";

export default function ProfileEditor() {
  const {currentUser, refreshUser} = useAuth();
  const [firstName, setFirstName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [about, setAbout] = useState<string>('');
  const [emergencyContact, setEmergencyContact] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false)


  // The current user shouldnt change while editing - this handles
  // making sure we update it when it does change.
  useEffect(() => {
    setFirstName(currentUser ? currentUser.first_name : '')
    setSurname(currentUser ? currentUser.last_name : '')
    setMobileNumber(currentUser ? currentUser.mobile_number : '')
    setAbout(currentUser ? currentUser.about : '')
    setEmergencyContact(currentUser ? (currentUser?.in_case_emergency || '') : '')
  }, [currentUser])
  
  const approved = currentUser?.is_approved;

  const updateUser = useCallback(event => {
    event.preventDefault();
    if (currentUser) {
      let newUser = Object.assign({}, currentUser);
      newUser.first_name = firstName;
      newUser.last_name = surname;
      newUser.about = about;
      newUser.mobile_number = mobileNumber;
      newUser.in_case_emergency = emergencyContact;

      api.put(`users/${currentUser.id}/`, newUser).then(res => {
        refreshUser();
        setSubmitted(true);
      })
    }
  }, [about, currentUser, firstName, surname, mobileNumber, refreshUser, emergencyContact])

  const labelStyles = "block text-gray-700 text-sm font-bold mb-2"
  const inputStyles = "px-2 py-1 shadow border rounded w-full leading-tight focus:shadow-lg mb-4" 

  if (currentUser && submitted && approved) {
    return <Navigate to={`../${currentUser.id}`} />
  }

  return (
    <div className="w-3/4 mx-auto bg-white shadow-md roudned p-8 m-4">
      <h1 className="text-lg font-bold text-gray-700 tracking-wide">Edit Profile</h1>
      {(!approved) && <p className="text-gray-700 text-sm italic">
        Thanks for signing up! Let us know a bit more about you below...
      </p>}
      <form onSubmit={updateUser} className="mt-4">
        <div className="flex w-full">
          <div className="flex-grow mr-2">
            <label className={labelStyles} htmlFor="firstName">First Name*</label>
            <input 
              className={inputStyles} type="string" id="firstName" 
              value={firstName} onChange={event => setFirstName(event.target.value)} />
          </div>
          <div className="flex-grow ml-2">
            <label className={labelStyles} htmlFor="surname">Surname*</label>
            <input 
              className={inputStyles} type="string" id="surname" 
              value={surname} onChange={event => setSurname(event.target.value)} />
          </div>
        </div>
        <label className={labelStyles} htmlFor="about">Bio</label>
        <p className="text-sm text-gray-700 italic mb-2 ml-2">
          Write about yourself and what brings you to our club! {!approved && <span> This will be visible to all members once you are approved, but you can change it later on. Feel free to leave this blank for now.</span>}
        </p>
        <textarea className={inputStyles + " resize-none h-80"} id="about" 
          value={about} onChange={event => setAbout(event.target.value)} />
        <label className={labelStyles} htmlFor="mobile">Mobile Number</label>
        <p className="text-sm text-gray-700 italic mb-2 ml-2">
          Optional. We make this visible to all members if you provide it as it's useful for organising walks and quickly 
          getting in touch with people.
        </p>
        <input
          className={inputStyles} type="string" id="mobile"
          value={mobileNumber} onChange={(event => setMobileNumber(event.target.value))} />
        {approved && (
          <>
            <label className={labelStyles} htmlFor="emergencyContact">Emergency Contact</label>
            <p className="text-sm text-gray-700 italic mb-2 ml-2">
              Please provide if joining for an event - include phone number and relationship/other notes.
            </p>
            <input
              className={inputStyles} type="string" id="emergencyContact"
              value={emergencyContact} onChange={(event => setEmergencyContact(event.target.value))} />
          </>
        )}
        <div className="flex justify-between">
          <button
            className="block rounded bg-blue-500 hover:bg-blue-700 text-white font-bold p-3"
            type="submit">
              {approved ? "Update" : "Submit"}
          </button>
          <Link to={currentUser ? `../${currentUser.id}` : ''}>
            <button className="ml-auto block rounded bg-gray-300 hover:bg-gray-400 text-gray-700 p-3">Cancel</button>
          </Link>
        </div>
      </form>
      {(submitted && !approved) && <p>Thank you for submitting! It looks like some required information may be missing - double check and edit your answers above! If all looks good you should be approved for access shortly.</p>}
    </div>
  )
}