import React, { useEffect, useState } from "react";
import * as models from "../models";
import api from "../api";
import Loading from "./Loading";

export default function Feed() {
  const [postList, setPostList] = useState<Array<models.FeedPost>>([])
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.get("posts/").then(response => {
      setPostList(response.data);
      setIsLoading(false);
    });
  }, [setIsLoading, setPostList])

  return (
    <Loading loading={isLoading}>
      <h2>Newsfeed</h2> 
      <button>New Post</button>
      {postList.map(post => <Post {...post} />)}
      
    </Loading>
  )
}

function Post({ id, user, posted, text, comments }: models.FeedPost) {
  return (
    <div>
      <h3>{user.first_name} {user.last_name} ({posted})</h3>
      <p>{text}</p>
      {comments.map((comment: models.Comment) => <Comment {...comment} />)}
    </div>
  )
}

function Comment({ user, posted, text }: models.Comment) {
  return (
    <div>
      <h4>{user.first_name} {user.last_name} ({posted})</h4>
      <p>{text}</p>
    </div>
  )

}