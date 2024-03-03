import React, { useCallback } from "react";
import api from "../../api";
import { FullUser } from "../../models";
import { useAuth } from "../Layout";
import { ProfileButton } from "./Profile";

interface ApprovalButtonProps {
  user: FullUser | null;
  refreshUser: () => void;
}

export default function AdminTools({ user, refreshUser }: ApprovalButtonProps) {
  const { currentUser } = useAuth();
  const endDate = "2025-03-31";

  const setMember = useCallback(() => {
    if (user) {
      api
        .post(`users/${user.id}/membership/`, { membership_expiry: endDate })
        .then((res) => refreshUser());
    }
  }, [user, refreshUser, endDate]);

  const unsetMember = useCallback(() => {
    if (user) {
      api.delete(`users/${user.id}/membership/`).then((res) => refreshUser());
    }
  }, [user, refreshUser]);

  const toggleWinter = useCallback(() => {
    if (!user) {
      return null;
    } else {
      console.log(user.is_winter_skills);
      api
        .patch(`users/${user.id}/`, {
          is_winter_skills: !user.is_winter_skills,
        })
        .then((res) => refreshUser());
    }
  }, [user, refreshUser]);

  if (user && currentUser?.is_committee) {
    return (
      <div className="rounded shadow p-2">
        <h1 className="text-lg mb-3">Admin Tools</h1>
        <span className="ml-2">
          <ProfileButton onClick={setMember}>
            Set Member ({endDate})
          </ProfileButton>
        </span>
        <span className="ml-2">
          <ProfileButton onClick={unsetMember}>Remove Member</ProfileButton>
        </span>
        <span className="ml-2">
          <ProfileButton onClick={toggleWinter}>
            Toggle Winter Skills
          </ProfileButton>
        </span>
        <span className="ml-2 text-sm">Email: {user.email}</span>
      </div>
    );
  } else {
    return null;
  }
}
