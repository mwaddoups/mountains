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

  return (
    <form onSubmit={e => {
      e.preventDefault();
      console.log(e);
    }}>
      <label htmlFor="firstName">First Name</label>
      <input type="string" id="firstName" />
      <label htmlFor="surname">Surname</label>
      <input type="string" id="surname" />
      <label htmlFor="about">About</label>
      <input type="string" id="about" />
      <button type="submit">Update</button>
      <Link to=".">Cancel</Link>
    </form>
  )
}