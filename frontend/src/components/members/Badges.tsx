import styled from "@emotion/styled";
import React from "react";
import tw from "twin.macro";
import { User } from "../../models";

interface BadgesProps {
  user: User | null;
}

export default function Badges({ user }: BadgesProps) {
  if (!(user?.is_approved)) {
    return <ProfileBadge $badgeColor="red">Unapproved</ProfileBadge>
  } else if (user?.is_committee) {
    return <ProfileBadge $badgeColor="purple">Committee</ProfileBadge>
  } else if (user?.is_paid) {
    return <ProfileBadge $badgeColor="blue">Member</ProfileBadge>
  } else {
    return <ProfileBadge $badgeColor="green">Guest</ProfileBadge>
  }
}
export function BadgesLong({ user }: BadgesProps) {
  return (
  <>
    {!(user?.is_approved) && <ProfileBadge $badgeColor="red">Unapproved</ProfileBadge>}
    {user?.is_committee && <ProfileBadge $badgeColor="purple">Committee</ProfileBadge>}
    {user?.is_paid 
      ? <ProfileBadge $badgeColor="blue">Member</ProfileBadge>
      : <ProfileBadge $badgeColor="green">Guest</ProfileBadge>}
  </>
  )
}

interface ProfileBadgeProps {
  $badgeColor: "red" | "green" | "purple" | "blue";
}

const colorVariants = {
  red: tw`bg-red-400 text-gray-100`,
  green: tw`bg-green-400 text-gray-100`,
  purple: tw`bg-purple-400 text-gray-100`,
  blue: tw`bg-blue-400 text-gray-100`,
}

const ProfileBadge = styled.span(({$badgeColor}: ProfileBadgeProps) => [
 tw`rounded-lg m-1 px-3 py-0.5 text-sm flex-initial truncate block sm:inline-block`,
 colorVariants[$badgeColor], 
])