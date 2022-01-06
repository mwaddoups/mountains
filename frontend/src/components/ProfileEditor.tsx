import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import { FullUser } from "../models";

export default function ProfileEditor() {
  const [user, setUser] = useState<FullUser | null>(null);
  const { memberId } = useParams();


  useEffect(() => {
    api.get(`users/${memberId}`).then(response => {
      let foundUser = response.data;
      setUser(foundUser);
    });
  }, [setUser, memberId])

  const labelStyles = "block text-gray-700 text-sm font-bold mb-2"
  const inputStyles = "px-2 py-1 shadow border rounded w-full leading-tight focus:shadow-outline mb-4" 

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md roudned p-8 m-4">
      <h1 className="text-lg font-bold text-gray-700 tracking-wide mb-4">Edit Profile</h1>
      <form onSubmit={e => {
        e.preventDefault();
        console.log(e);
      }}>
        <label className={labelStyles} htmlFor="firstName">First Name</label>
        <input className={inputStyles} type="string" id="firstName" />
        <label className={labelStyles} htmlFor="surname">Surname</label>
        <input className={inputStyles} type="string" id="surname" />
        <label className={labelStyles} htmlFor="about">About</label>
        <textarea className={inputStyles + " resize-none h-80"} id="about" />
        <div className="flex justify-between">
          <button
            className="block rounded bg-blue-500 hover:bg-blue-700 text-white font-bold p-3"
            type="submit">Update</button>
          <Link to=".">
            <button className="ml-auto block rounded bg-gray-300 hover:bg-gray-400 text-gray-700 p-3">Cancel</button>
          </Link>
        </div>
      </form>
    </div>
  )
}