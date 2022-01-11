import React from "react";
import { User } from "../../models";
import ProfilePicture from "../members/ProfilePicture";
import { getName } from "../../methods/user";
import { describe_date } from "../../utils";
import { Link } from "react-router-dom";

interface UserPostProps {
  user: User,
  posted: string,
  text: string,
}

export default function UserPost({user, posted, text}: UserPostProps) {
  return (
    <div className="flex">
      <div className="w-8 h-8">
        <Link to={`../members/${user.id}`}>
          <ProfilePicture imageUrl={user.profile_picture} />
        </Link>
      </div>
      <div className="ml-3">
        <Link to={`../members/${user.id}`} 
          className="font-semibold hover:underline">{getName(user)}</Link>
        <span className="ml-3 text-sm font-light">{describe_date(posted)}</span>
        <p className="text-sm whitespace-pre-line">{text}</p>
      </div>
    </div>
  )
}
