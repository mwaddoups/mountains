import React from "react";
import { Link } from "react-router-dom";
import { getName } from "../../methods/user";
import { User } from "../../models";
import Badges from "./Badges";
import ProfilePicture from "./ProfilePicture";

interface ProfileSquareProps {
  user: User,
}

export default function ProfileSquare({user}: ProfileSquareProps) {
  return (
    <Link to={`${user.id}`} className={`inline-block w-48 p-2 shadow rounded-lg mr-2 mt-2`}>
      <div className="mx-auto w-3/4">
        <ProfilePicture imageUrl={user.profile_picture} />
      </div>
      <div className="mx-auto text-center mt-2">
        <h1 className="font-light">{getName(user)}</h1> 
      </div>
      <div className="mx-auto w-full text-center flex justify-center mb-2">
        <Badges user={user} />
      </div>
    </Link>
  )
}