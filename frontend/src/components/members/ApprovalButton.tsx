import React, { useCallback } from "react";
import api from "../../api";
import { FullUser } from "../../models";
import { useAuth } from "../Layout";
import { ProfileButton } from "./Profile";

interface ApprovalButtonProps {
  user: FullUser | null;
  setNeedsRefresh: (a: boolean) => void;
}

export default function ApprovalButton({ user, setNeedsRefresh }: ApprovalButtonProps) {
  const { currentUser } = useAuth();

  const approveUser = useCallback(() => {
    if (!user) {
      return null;
    } else {
      api.post(`users/${user.id}/approve/`, {}).then(res => setNeedsRefresh(true))

    }

  }, [user, setNeedsRefresh])

  if (user && !(user.is_approved) && currentUser?.is_committee) {
    return (
      <div className="rounded shadow p-2">
        <h1 className="text-lg mb-3">Admin Tools</h1>
        <ProfileButton onClick={approveUser}>Approve User</ProfileButton>
      </div>
    )
  } else {
    return null;
  }
}