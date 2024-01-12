import React from "react";
import { User } from "../../models";
import { Badge } from "../base/Base";
import { Snow } from "react-bootstrap-icons";

interface BadgesProps {
  user: User | null;
}

export default function Badges({ user }: BadgesProps) {
  if (!(user?.is_approved)) {
    return <Badge $badgeColor="red">Unapproved</Badge>
  } else if (user?.is_committee) {
    return <Badge $badgeColor="purple">Committee</Badge>
  } else if (user?.is_paid) {
    return <Badge $badgeColor="blue">Member</Badge>
  } else {
    return <Badge $badgeColor="green">Guest</Badge>
  }
}
export function BadgesLong({ user }: BadgesProps) {
  return (
  <>
    {!(user?.is_approved) && <Badge $badgeColor="red">Unapproved</Badge>}
    {user?.is_committee && <Badge $badgeColor="purple">Committee</Badge>}
    {user?.is_paid 
      ? <Badge $badgeColor="blue">Member</Badge>
      : <Badge $badgeColor="green">Guest</Badge>}
    {user?.is_winter_skills && <Badge $badgeColor="lightblue"><Snow /></Badge>}
  </>
  )
}