import React, { useEffect, useState, useMemo } from "react";
import tw from "twin.macro";
import api from "../api";
import { User } from "../models";
import Loading from "./Loading";
import ProfileSquare from "./ProfileSquare";

export default function Members() {
  // Fill with fake users for the first load
  const [userList, setUserList] = useState<Array<User>>(Array(2).fill(
    {id: 1, url: '', first_name: 'User', last_name: '', profile_picture: undefined, is_approved: true},
  ))
  const [isLoading, setIsLoading] = useState(true);
  const [searchString, setSearchString] = useState('');

  useEffect(() => {
    setIsLoading(true);
    api.get("users/").then(response => {
      setUserList(response.data);
      setIsLoading(false);
    });
  }, [setIsLoading, setUserList])
  
  let filteredUsers = useMemo(() => {
    if (!searchString) {
      return userList
    } else {
      const searchKeywords = searchString.split(" ");
      return userList.filter(user => searchKeywords.filter(k => k).some(keyword => (
          user.first_name.includes(keyword) || user.last_name.includes(keyword)
        )
      ))
    }
  }, [searchString, userList])

  return (
    <Loading loading={isLoading}>
      <SearchInput placeholder="Enter name to search..." type="text" id="search" value={searchString} onChange={event => setSearchString(event?.target.value)} /> 
      <div className="flex flex-wrap">
        {filteredUsers.map((user, ix) => <ProfileSquare key={ix} user={user} />)}
      </div>
    </Loading>
  )
}

const SearchInput = tw.input`w-full m-2 shadow p-2 text-sm`