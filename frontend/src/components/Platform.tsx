import React, { useMemo } from "react";
import { Link, Outlet } from "react-router-dom";

import { useAuth } from "./Layout";
import Login from "./Login";
import ProfileEditor from "./members/ProfileEditor";
import Sidebar from "./Sidebar";

export default function Platform() {
  const authContext = useAuth()
  const { authToken, currentUser, storeAuth } = authContext;

  let missingPicture = useMemo(() => !(currentUser?.profile_picture), [currentUser])

  if (!authToken) {
    return <Login setAuthToken={storeAuth} />
  }

  if (authToken && currentUser && !currentUser.is_approved) {
    return <ProfileEditor />
  }


  return (
    <div className="min-h-screen container flex">
      <div className="sm:w-32 flex-none grow bg-teal-600 text-gray-100">
        <Sidebar />
      </div>
      <main className="ml-1 sm:ml-5 flex-auto w-full my-3">
        {currentUser && missingPicture && (
          <div className="bg-yellow-300 p-2 shadow rounded mb-2 text-sm font-bold underline text-gray-900 hover:text-gray-500">
            <p><Link to={`members/${currentUser.id}`}>Complete your profile! Add your experience and a profile picture...</Link></p>
          </div>
        )}
        <Outlet context={authContext} />
      </main>
    </div>
  )
}
