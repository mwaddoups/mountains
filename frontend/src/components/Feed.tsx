import React, { useCallback, useEffect, useState } from "react";
import * as models from "../models";
import api from "../api";
import Loading from "./Loading";

export default function Feed() {
  const [postList, setPostList] = useState<Array<models.FeedPost>>([]);
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
      <PostCreator />
      {postList.map(post => <Post key={post.id} {...post} />)}
      
    </Loading>
  )
}

function PostCreator() {
  const [postText, setPostText] = useState<string>('');

  const sendPost = useCallback(async () => {
    let userResponse = await api.get('users/self/');
    let userId = userResponse.data.id;
    
    try {
      await api.post('posts/', { user_id: userId, text: postText})
    } catch (err) {
      console.log(err)
    }

    setPostText('')
  }, [postText])

  return (
    <form onSubmit={e => e.preventDefault()}>
      <textarea id="text" value={postText} onChange={event => setPostText(event.target.value)}></textarea>
      <button onClick={sendPost}>Submit</button>
    </form>
  )

}

function Post({ id, user, posted, text, comments }: models.FeedPost) {
  return (
    <div>
      <h3>{user.first_name} {user.last_name} ({posted})</h3>
      <p>{text}</p>
      {comments.map((comment: models.Comment) => <Comment key={comment.id} {...comment} />)}
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