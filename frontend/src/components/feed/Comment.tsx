import React from "react";
import * as models from "../../models";
import UserPost from "./UserPost";

export default function Comment({ user, posted, text }: models.Comment) {
  return (
    <div className="my-2 p-2 rounded bg-gray-300">
      <UserPost user={user} posted={posted} text={text} />
    </div>
  )
}
