import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { User } from "../models";
import { useAuth } from "./Platform";

type Experiences = {
  hillwalking: number,
}

interface UserWithExperience extends User {
  experience: Experiences
}

export default function Profile() {
  const [user, setUser] = useState<UserWithExperience | null>(null)
  let { memberId } = useParams();

  const authToken = useAuth();

  // Fetch the user data together with the experience
  useEffect(() => {
    api.get(`users/${memberId}`).then(response => {
      let foundUser = response.data;
      api.get(`users/${memberId}/experience`).then(response => {
        foundUser.experience = response.data[0];
        setUser(foundUser);
        console.log(foundUser)
      })
    });
  }, [setUser, authToken, memberId])

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