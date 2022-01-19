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
    <Link to={`${user.id}`} className="inline-block w-full sm:w-48 p-2 shadow rounded-lg mr-2 mt-2 flex sm:block items-center justify-between">
      <div className="w-16 sm:mx-auto sm:w-3/4 flex-none">
        <ProfilePicture user={user} />
      </div>
      <div className="m-2 sm:mx-auto text-center sm:mt-2">
        <h1 className="font-light">{getName(user)}</h1> 
      </div>
      <div className="sm:mx-auto sm:w-full text-center block sm:flex justify-center mb-2">
        <Badges user={user} />
      </div>
    </Link>
  )
}