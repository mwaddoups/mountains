import React, { useEffect, useState } from "react";
import api from "../api";
import { User } from "../models";
import Loading from "./Loading";
import ProfileSquare from "./ProfileSquare";

export default function Members() {
  // Fill with fake users for the first load
  const [userList, setUserList] = useState<Array<User>>(Array(20).fill(
    {id: 1, url: '', first_name: 'User', last_name: '', profile_picture: undefined, is_approved: true},
  ))
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.get("users/").then(response => {
      setUserList(response.data);
      setIsLoading(false);
    });
  }, [setIsLoading, setUserList])

  return (
    <Loading loading={isLoading}>
      <div className="flex flex-wrap">
        {userList.map((user, ix) => <ProfileSquare key={ix} user={user} />)}
      </div>
    </Loading>
  )
}
