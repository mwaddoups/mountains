import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { User } from "../models";
import Loading from "./Loading";
import ProfilePicture from "./ProfilePicture";

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

interface ProfileSquareProps {
  user: User,
}
function ProfileSquare({user}: ProfileSquareProps) {
  return (
    <Link to={`${user.id}`}>
      <div className="w-32 rounded-lg p-2">
        <div className="relative z-0 mx-auto w-5/6">
          <ProfilePicture imageUrl={user.profile_picture} />
        </div>
        <div className="relative border border-gray-300 mx-auto text-center -mt-3 bg-white rounded z-50">
          <h1 className="text-sm font-semibold">{user.first_name} {user.last_name}</h1> 
        </div>

      </div>
    </Link>
  )
}
