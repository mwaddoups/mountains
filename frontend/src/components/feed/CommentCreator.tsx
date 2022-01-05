import React, { useCallback, useState } from "react";
import api from "../../api";

interface CommentCreatorProps {
  postUrl: string;
  updateComments: () => void,
}

export default function CommentCreator({postUrl, updateComments}: CommentCreatorProps) {
  const [commentText, setCommentText] = useState<string>('');

  const sendComment = useCallback(async () => {
    try {
      await api.post('comments/', { post_id: postUrl, text: commentText});
    } catch (err) {
      console.log(err);
    }

    setCommentText('');
    updateComments();
  }, [postUrl, commentText, setCommentText, updateComments])

  return (
    <form onSubmit={e => e.preventDefault()}>
      <textarea id="text" value={commentText} onChange={event => setCommentText(event.target.value)}></textarea>
      <button onClick={sendComment}>Submit</button>
    </form>
  )

}