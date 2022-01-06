import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { FullUser } from "../models";
import ProfilePicture from "./ProfilePicture";

export default function Profile() {
  const [user, setUser] = useState<FullUser | null>(null);
  let { memberId } = useParams();

  // Fetch the user data together with the experience
  useEffect(() => {
    api.get(`users/${memberId}`).then(response => {
      let foundUser = response.data;
      setUser(foundUser);
    });
  }, [setUser, memberId])

  return (
    <div className="flex h-full">
      <div className="flex-auto py-4">
        <div>
          <h1 className="text-5xl font-medium">
            {user?.first_name} {user?.last_name}
          </h1>
        </div>
        <div className="py-4">
          Badges go here
        </div>
        <div className="h-40 min-h-40">
          <h2 className="text-3xl font-medium">About</h2>
          <p>{user?.about ? user.about : "Nothing here yet!"}</p>
        </div>
        <div>
          <h2 className="text-3xl font-medium">Experience</h2>
          <ul>
            <li>Hillwalking - {user?.experience.hillwalking}</li>
          </ul>
        </div>
      </div>
      <div className="ml-auto">
        <div className="w-64 h-64 p-4">
          <ProfilePicture imageUrl={user?.profile_picture} />
        </div>
        <div className="flex justify-center">
        <button className="rounded-lg bg-blue-500 p-2 text-gray-100 b-1 text-sm">Update profile picture</button>
        </div>
      </div>
    </div>
  )
}