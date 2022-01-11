import tw from "twin.macro";

const BaseArea = tw.textarea`px-2 py-1 rounded w-full leading-tight resize-none h-32`;

export const PostArea = tw(BaseArea)`w-full h-32`
export const CommentArea = tw(BaseArea)`w-3/4 h-full text-sm`
export const SubmitButton = tw.button`mt-4 px-2 py-1 rounded-lg bg-blue-400 text-gray-100 hover:bg-blue-600`