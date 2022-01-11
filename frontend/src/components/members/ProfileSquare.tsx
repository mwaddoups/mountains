import React from "react";
import { Link } from "react-router-dom";
import { getName } from "../../methods/user";
import { User } from "../../models";
import ProfilePicture from "./ProfilePicture";

interface ProfileSquareProps {
  user: User,
  size: string,
}

export default function ProfileSquare({user, size}: ProfileSquareProps) {
  return (
    <Link to={`${user.id}`} className={`inline-block w-${size} h-${size} p-2 shadow mr-2 mt-2`}>
      <div className="relative z-0 mx-auto w-3/4 h-3/4">
        <ProfilePicture imageUrl={user.profile_picture} />
      </div>
      <div className="relative mx-auto text-center mt-2 bg-white rounded z-50">
        <h1 className="font-light">{getName(user)}</h1> 
      </div>
    </Link>
  )
}