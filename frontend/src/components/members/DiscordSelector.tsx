import { Discord } from "react-bootstrap-icons";
import { User } from "../../models";
import { useAuth } from "../Layout";
import { SmallButton, SmallCancelButton } from "../base/Base";
import { useCallback, useEffect, useState } from "react";
import api from "../../api";

interface DiscordSelectorProps {
  user: User;
  refreshProfile: () => void;
}

type DiscordUser = {
  id: string;
  username: string;
};

export default function DiscordSelector({
  user,
  refreshProfile,
}: DiscordSelectorProps) {
  const [userList, setUserList] = useState<Array<DiscordUser>>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("null");
  const [displayName, setDisplayName] = useState<string>("<No user found>");
  const { currentUser } = useAuth();

  const getUserList = useCallback(() => {
    api.get("users/discord/members/").then((res) => {
      setUserList(res.data);
    });
  }, []);

  useEffect(() => {
    if (user.discord_id) {
      api.get(`users/discord/members/${user.discord_id}/`).then((res) => {
        setDisplayName(
          `${res.data.nick || res.data.user.username} (${
            res.data.user.username
          }) ${res.data.is_member ? "[M]" : ""}`
        );
      });
    }
  }, [user.discord_id]);

  const saveUsername = useCallback(() => {
    api
      .patch(`users/${user.id}/`, {
        discord_id: selectedUserId === "null" ? null : selectedUserId,
      })
      .then((res) => {
        setUserList([]);
        refreshProfile();
      });
  }, [selectedUserId, user, refreshProfile]);

  const isUser = currentUser && user && currentUser.id === user.id;

  return (
    <div className="flex items-center">
      <Discord className="ml-2 text-gray-500 text-sm" />
      {userList.length === 0 && (
        <>
          <p className="ml-1 text-sm text-gray-500 tracking-wide">
            {displayName}
          </p>
          {isUser && (
            <SmallButton className="ml-1" onClick={getUserList}>
              Change
            </SmallButton>
          )}
        </>
      )}
      {userList.length > 0 && (
        <>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="text-xs text-gray-500 w-32 px-1 py-1"
          >
            <option value={"null"} className="text-xs">
              No username
            </option>
            {userList.map((u) => (
              <option key={u.id} value={u.id} className="text-xs">
                {u.username}
              </option>
            ))}
          </select>
          <SmallButton className="ml-1" onClick={saveUsername}>
            Save
          </SmallButton>
          <SmallCancelButton className="ml-1" onClick={() => setUserList([])}>
            Cancel
          </SmallCancelButton>
        </>
      )}
    </div>
  );
}
