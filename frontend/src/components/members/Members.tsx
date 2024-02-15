import React, { useEffect, useState, useMemo } from "react";
import tw from "twin.macro";
import api from "../../api";
import { searchUsers } from "../../methods/user";
import { User } from "../../models";
import { useAuth } from "../Layout";
import Loading from "../Loading";
import ProfileSquare from "./ProfileSquare";

export default function Members() {
  // Fill with fake users for the first load
  const [userList, setUserList] = useState<Array<User>>(
    Array(5).fill({
      id: 1,
      url: "",
      first_name: "User",
      last_name: "",
      profile_picture: undefined,
      is_approved: true,
    })
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchString, setSearchString] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    setIsLoading(true);
    api.get("users/").then((response) => {
      setUserList(response.data);
      setIsLoading(false);
    });
  }, [setIsLoading, setUserList]);

  let filteredUsers = useMemo(() => {
    // Only committee can see unapproved users
    let approvedUsers = userList
      .filter((user) => user.is_approved || currentUser?.is_committee)
      .sort((lowerUser, higherUser) => {
        if (lowerUser.is_approved && !higherUser.is_approved) {
          return -1;
        } else if (!lowerUser.is_approved && higherUser.is_approved) {
          return 1;
        } else if (lowerUser.is_committee && !higherUser.is_committee) {
          return -1;
        } else if (!lowerUser.is_committee && higherUser.is_committee) {
          return 1;
        } else if (
          lowerUser.membership_expiry &&
          !higherUser.membership_expiry
        ) {
          return -1;
        } else if (
          !lowerUser.membership_expiry &&
          higherUser.membership_expiry
        ) {
          return 1;
        } else {
          return lowerUser.id - higherUser.id;
        }
      });
    if (!searchString) {
      return approvedUsers;
    } else {
      return searchUsers(approvedUsers, searchString);
    }
  }, [searchString, userList, currentUser]);

  return (
    <Loading loading={isLoading}>
      <SearchInput
        placeholder="Enter name to search..."
        type="text"
        id="search"
        value={searchString}
        onChange={(event) => setSearchString(event?.target.value)}
      />
      <div className="flex flex-wrap">
        {filteredUsers.map((user, ix) => (
          <ProfileSquare key={ix} user={user} />
        ))}
      </div>
    </Loading>
  );
}

const SearchInput = tw.input`w-full shadow p-2 text-sm`;
