import React, { useCallback, useState } from "react";
import tw from "twin.macro";
import api from "../../api";
import { CommentArea, SubmitButton } from "./styled";

const CommentSubmitButton = tw(SubmitButton)`ml-4 text-xs my-4`

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
  }, [commentText, setCommentText, updateComments, postUrl])

  return (
    <div className="ml-10 p-2 flex flex-nowrap h-16">
      <form onSubmit={e => e.preventDefault()}>
        <CommentArea id="text" value={commentText} onChange={event => setCommentText(event.target.value)} placeholder="Add a comment..."></CommentArea>
        <CommentSubmitButton onClick={sendComment}>Submit</CommentSubmitButton>
      </form>
    </div>
  )

}