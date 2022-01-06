import React from "react";
import { PersonSquare } from "react-bootstrap-icons";

interface ProfilePictureProps {
  imageUrl: string | undefined,
}

export default function ProfilePicture({imageUrl}: ProfilePictureProps) {
  const styles = "w-full h-full rounded-lg"
  return imageUrl
    ? <img src={imageUrl} alt="Profile" className={styles} />
    : <PersonSquare className={styles} color="orange" /> 
}