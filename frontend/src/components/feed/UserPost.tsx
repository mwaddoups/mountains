import React from "react";
import { User } from "../../models";

interface UserPostProps {
  user: User,
  posted: Date,
  text: string,
}

export default function UserPost({user, posted, text}: UserPostProps) {
  return (
    <div>
      <h3>{user.first_name} {user.last_name} ({posted})</h3>
      <p>{text}</p>
    </div>
  )
}