import React, { useCallback } from "react";
import api from "../../api";
import { FullUser } from "../../models";
import { useAuth } from "../Layout";
import { ProfileButton } from "./Profile";

interface ApprovalButtonProps {
  user: FullUser | null;
  setNeedsRefresh: (a: boolean) => void;
}

export default function AdminTools({ user, setNeedsRefresh }: ApprovalButtonProps) {
  const { currentUser } = useAuth();

  const approveUser = useCallback(() => {
    if (!user) {
      return null;
    } else {
      api.post(`users/${user.id}/approve/`, {}).then(res => setNeedsRefresh(true))

    }

  }, [user, setNeedsRefresh])

  const togglePaid = useCallback(() => {
    if (!user) {
      return null;
    } else {
      api.post(`users/${user.id}/paid/`, {}).then(res => setNeedsRefresh(true))

    }

  }, [user, setNeedsRefresh])

  if (user && currentUser?.is_committee) {
    return (
      <div className="rounded shadow p-2">
        <h1 className="text-lg mb-3">Admin Tools</h1>
        {!user.is_approved && <ProfileButton onClick={approveUser}>Approve User</ProfileButton>}
        <span className="ml-2"><ProfileButton onClick={togglePaid}>Toggle Member/Guest</ProfileButton></span>
      </div>
    )
  } else {
    return null;
  }
}