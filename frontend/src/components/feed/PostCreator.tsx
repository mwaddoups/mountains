import React, { useCallback, useState } from "react";
import api from "../../api";

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
    <form onSubmit={e => e.preventDefault()}>
      <textarea id="text" value={postText} onChange={event => setPostText(event.target.value)}></textarea>
      <button onClick={sendPost}>Submit</button>
    </form>
  )

}