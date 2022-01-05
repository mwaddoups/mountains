import React, { useState, useCallback } from "react";
import api from "../../api";
import * as models from "../../models";
import Comment from "./Comment";
import CommentCreator from "./CommentCreator";

export default function Post(initialPost: models.FeedPost) {
  let [post, setPost] = useState<models.FeedPost>(initialPost);

  let updatePost = useCallback(async () => {
    let updatedPost = await api.get(post.url);
    setPost(updatedPost.data);
  }, [post, setPost])

  return (
    <div className="m-5 p-5 block rounded bg-gray-200">
      <h3>{post.user.first_name} {post.user.last_name} ({post.posted})</h3>
      <p>{post.text}</p>
      {post.comments.map((comment: models.Comment) => <Comment key={comment.id} {...comment} />)}
      <CommentCreator postUrl={post.url} updateComments={updatePost} />
    </div>
  )
}