import React from "react";
import { User } from "../../models";
import dateFormat from "dateformat";
import ProfilePicture from "../ProfilePicture";
import { getName } from "../../methods/user";

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
        <p className="text-sm">{text}</p>
      </div>
    </div>
  )
}

function describe_date(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);

  if (date.getFullYear() === now.getFullYear()) {
    const nearFormat = dateFormat(date, 'DDDD, mmm d')
    const farFormat = dateFormat(date, 'dddd, mmm d')
    if (nearFormat !== farFormat) {
      // This means that its today or yesterday or tomorrow
      return dateFormat(date, 'DDDD, HH:MM');
    } else {
      return dateFormat(date, 'mmm d, HH:MM');
    }
  } else {
    return dateFormat(date, 'mmm d, yyyy, HH:MM')
  }
}