import React, { useEffect, useState } from "react";
import api from "../../api";
import { FeedPost } from "../../models";
import Loading from "../Loading";
import Post from "./Post";
import PostCreator from "./PostCreator";

export default function Feed() {
  const [postList, setPostList] = useState<Array<FeedPost>>([]);
  const [postCreated, setPostCreated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.get("posts/").then(response => {
      setPostList(response.data);
      setIsLoading(false);
    });
  }, [setIsLoading, setPostList, postCreated])

  return (
    <Loading loading={isLoading}>
      <h2>Newsfeed</h2> 
      {
        postCreated 
        ? <p>Post created!</p>
        : <PostCreator setPostCreated={setPostCreated}/>
      }
      {postList.map(post => <Post key={post.id} {...post} />)}
      
    </Loading>
  )
}

