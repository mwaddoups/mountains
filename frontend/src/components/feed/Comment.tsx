import React from "react";
import * as models from "../../models";

export default function Comment({ user, posted, text }: models.Comment) {
  return (
    <div className="m-2 p-2 rounded bg-gray-300">
      <h4>{user.first_name} {user.last_name} ({posted})</h4>
      <p>{text}</p>
    </div>
  )
}
