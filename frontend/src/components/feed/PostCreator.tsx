import React, { useCallback, useState } from "react";
import api from "../../api";
import { PostArea, SubmitButton } from "./styled";

interface PostCreatorProps {
  setPostCreated: (a: boolean) => void,
}


export default function PostCreator({setPostCreated}: PostCreatorProps) {
  const [postText, setPostText] = useState<string>('');

  const sendPost = useCallback(async () => {
    try {
      await api.post('posts/', { text: postText});
    } catch (err) {
      console.log(err);
    }

    setPostText('');
    setPostCreated(true);
  }, [postText, setPostText, setPostCreated])

  return (
    <div className="m-4 p-4 rounded shadow border">
      <form onSubmit={e => e.preventDefault()}>
        <PostArea id="text" value={postText} onChange={event => setPostText(event.target.value)} placeholder="Enter a new post here..." />
        <SubmitButton onClick={sendPost}>Submit</SubmitButton>
      </form>
    </div>
  )
}