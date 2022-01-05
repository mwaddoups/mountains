import React from "react";
import { PersonSquare } from "react-bootstrap-icons";

interface ProfilePictureProps {
  imageUrl: string | undefined,
}

export default function ProfilePicture({imageUrl}: ProfilePictureProps) {
  return (
    <div className="w-8 h-8 bg-white rounded">
      {
        imageUrl
        ? <img src={imageUrl} alt="Profile" className="w-full h-full" />
        : <PersonSquare className="w-full h-full" color="orange" />
      }
    </div>
  )
}