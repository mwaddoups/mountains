import React, { useCallback, useState } from "react";
import api from "../../api";
import { searchUsers, getName } from "../../methods/user";
import { User } from "../../models";
import Loading from "../Loading";
import ProfilePicture from "../members/ProfilePicture";

interface AttendeeAdderProps {
    toggleAttendance: (userId: number) => (() => void);
}

export default function AttendeeAdder({ toggleAttendance }: AttendeeAdderProps) {
  let [isLoading, setIsLoading] = useState(false)
  let [userList, setUserList] = useState<Array<User> | null>(null)
  let [searchList, setSearchList] = useState<Array<User> | null>(null)
  let [searchString, setSearchString] = useState<string | null>(null);

  let handleValue = useCallback(searchValue => {
    if (!userList && !isLoading) {
      setIsLoading(true);
      api.get("users/").then(response => {
        setUserList(response.data);
        setIsLoading(false);
      });
    }
    
    setSearchString(searchValue);

    if (userList && searchString) {
      setSearchList(searchUsers(userList, searchString));
    }

  }, [isLoading, setIsLoading, setUserList, setSearchList, searchString, userList])

  let addUserToEvent = useCallback(user => {
    return () => {
      setSearchString(null);
      setSearchList(null);
      toggleAttendance(user.id)();
    }
  }, [toggleAttendance, setSearchString, setSearchList])


  return (
    <div>
      <input className="w-full shadow p-2 text-sm text-gray-500" type="text" 
        onClick={() => {if (searchString === null) {setSearchString("")}}}
        onChange={e => handleValue(e.target.value)} 
        value={(searchString === null) ? "Add a new user..." : searchString} />
      <Loading loading={isLoading}>
        {searchList && (
          <div className="border-gray-400 ml-5 p-2 border-1 rounded bg-white">
            {searchList.map(user => (
              <div key={user.id} onClick={addUserToEvent(user)} className="hover:bg-blue-400 h-10 flex items-center my-1">
                <div className="w-10"><ProfilePicture user={user} /></div>
                <p className="text-sm text-gray-500">{getName(user)}</p>
              </div>
            ))}
          </div>
        )}
      </Loading>
    </div>
  )
}