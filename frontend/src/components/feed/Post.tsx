import React from "react";
import * as models from "../../models";
import Comment from "./Comment";

export default function Post({ id, user, posted, text, comments }: models.FeedPost) {
  return (
    <div className="m-5 p-5 block rounded bg-gray-200">
      <h3>{user.first_name} {user.last_name} ({posted})</h3>
      <p>{text}</p>
      {comments.map((comment: models.Comment) => <Comment key={comment.id} {...comment} />)}
    </div>
  )
}