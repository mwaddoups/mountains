import React, { useEffect, useState } from "react";
import api from "../api";
import { User } from "../models";
import Loading from "./Loading";
import ProfileSquare from "./ProfileSquare";

export default function Members() {
  const [userList, setUserList] = useState<Array<User>>([])
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
        {userList.map(user => <ProfileSquare key={user.url} user={user} />)}
      </div>
    </Loading>
  )
}
