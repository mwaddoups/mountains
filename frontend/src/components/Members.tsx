import React, { useEffect, useState } from "react";
import api from "../api";
import { User } from "../models";

export default function Members() {
  const [userList, setUserList] = useState<Array<User>>([])
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.get("/users").then(response => {
      setUserList(response.data);
      setIsLoading(false);
    });
  }, [setIsLoading, setUserList])

  return (
    isLoading
    ? <h2>Loading...</h2>
    : <h2>{userList.map(user => <p key={user.id}>{JSON.stringify(user)}</p>)}</h2>
  )
}
