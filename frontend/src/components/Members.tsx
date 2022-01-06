import React, { useEffect, useState } from "react";
import api from "../api";
import { User } from "../models";
import Loading from "./Loading";

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
      <div>
        {userList.map(user => <p key={user.url}>{JSON.stringify(user)}</p>)}
      </div>
    </Loading>
  )
}
