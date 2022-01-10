import React, { useState, useCallback } from "react";
import api from "../../api";
import * as models from "../../models";
import Comment from "./Comment";
import CommentCreator from "./CommentCreator";
import UserPost from "./UserPost";

export default function Post(initialPost: models.FeedPost) {
  let [post, setPost] = useState<models.FeedPost>(initialPost);

  let updatePost = useCallback(async () => {
    let updatedPost = await api.get(post.url);
    setPost(updatedPost.data);
  }, [post, setPost])

  return (
    <div className="m-5 p-5 block rounded shadow bg-slate-100">
      <UserPost user={post.user} posted={post.posted} text={post.text} />
      <div className="ml-2">
        {post.comments.map((comment: models.Comment) => <Comment key={comment.id} {...comment} />)}
        <CommentCreator postUrl={post.url} updateComments={updatePost} />
      </div>
    </div>
  )
}