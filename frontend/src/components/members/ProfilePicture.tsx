import React from "react";
import { PersonSquare } from "react-bootstrap-icons";
import { NamedProfileUser } from "../../models";

interface ProfilePictureProps {
  user: NamedProfileUser | null,
}

export default function ProfilePicture({user}: ProfilePictureProps) {
  const styles = "w-full h-full rounded-lg"
  const imageUrl = user?.profile_picture;

  return imageUrl
    ? <img src={imageUrl} alt="Profile" className={styles} />
    : <PersonSquare className={styles} color={seededRandomColour(user?.id || 0)} /> 
}

function seededRandomColour(seed: number) {
  function LCG(s: number) {
    return (Math.imul(741103597, s) >>> 0) / 2 ** 32;
  }
  
  const symbols = '0123456789ABCDEF';
  
  let color = '#';
  
  for (let i = 0; i < 6; i++) {
    color += symbols[Math.round(LCG(seed + i) * 16)];
  }
  
  return color;
}