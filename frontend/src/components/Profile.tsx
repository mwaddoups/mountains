import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { FullUser } from "../models";

export default function Profile() {
  const [user, setUser] = useState<FullUser | null>(null);
  let { memberId } = useParams();

  // Fetch the user data together with the experience
  useEffect(() => {
    api.get(`users/${memberId}`).then(response => {
      let foundUser = response.data;
      setUser(foundUser)
    });
  }, [setUser, memberId])

  return (
    <div className="transition-all">
      <h1 className={"text-5xl font-medium" + (user ? "" : " w-40 h-8 bg-gray-200")}>
        {user?.first_name} {user?.last_name}
      </h1>
      <h2>About</h2>
      <p>{user?.about}</p>
      <h2>Qualifications</h2>
      <ul>
        <li>Hillwalking - {user?.experience.hillwalking}</li>
      </ul>
    </div>
  )
}