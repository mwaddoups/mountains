import React, { useEffect, useState } from "react";
import api from "../api";
import { User } from "../models";
import { useAuth } from "./Platform";

export default function Members() {
  const [userList, setUserList] = useState<Array<User>>([])
  const [isLoading, setIsLoading] = useState(true);

  const authToken = useAuth();

  useEffect(() => {
    setIsLoading(true);
    api.get("users/").then(response => {
      setUserList(response.data);
      setIsLoading(false);
    });
  }, [setIsLoading, setUserList, authToken])

  return (
    isLoading
    ? <h2>Loading...</h2>
    : <div>{userList.map(user => <p key={user.id}>{JSON.stringify(user)}</p>)}</div>
  )
}
