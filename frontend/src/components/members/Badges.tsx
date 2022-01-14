import styled from "@emotion/styled";
import React from "react";
import tw from "twin.macro";
import { User } from "../../models";

interface BadgesProps {
  user: User | null;
}

export default function Badges({ user }: BadgesProps) {
  return (
    <>
      {user?.is_approved
        ? <ProfileBadge $badgeColor="green">Approved</ProfileBadge>
        : <ProfileBadge $badgeColor="red">Unapproved</ProfileBadge>
      }
      {user?.is_committee
        && <ProfileBadge $badgeColor="purple">Committee</ProfileBadge>}
    </>
  )
}

interface ProfileBadgeProps {
  $badgeColor: "red" | "green" | "purple";
}

const colorVariants = {
  red: tw`bg-red-400 text-gray-100`,
  green: tw`bg-green-400 text-gray-100`,
  purple: tw`bg-purple-400 text-gray-100`,
}

const ProfileBadge = styled.span(({$badgeColor}: ProfileBadgeProps) => [
 tw`rounded-lg m-1 px-3 py-0.5 text-sm flex-initial truncate block sm:inline-block`,
 colorVariants[$badgeColor], 
])