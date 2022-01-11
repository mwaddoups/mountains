import React from "react";
import { User } from "../../models";
import ProfilePicture from "../members/ProfilePicture";
import { getName } from "../../methods/user";
import { describe_date } from "../../utils";

interface UserPostProps {
  user: User,
  posted: string,
  text: string,
}

export default function UserPost({user, posted, text}: UserPostProps) {
  return (
    <div className="flex">
      <div className="w-8 h-8">
        <ProfilePicture imageUrl={user.profile_picture} />
      </div>
      <div className="ml-3">
        <span className="font-semibold">{getName(user)}</span>
        <span className="ml-3 text-sm font-light">{describe_date(posted)}</span>
        <p className="text-sm whitespace-pre-line">{text}</p>
      </div>
    </div>
  )
}
