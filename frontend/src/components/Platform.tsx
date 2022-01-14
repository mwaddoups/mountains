import React from "react";
import { Outlet } from "react-router-dom";

import { useAuth } from "./Layout";
import Login from "./Login";
import ProfileEditor from "./members/ProfileEditor";
import Sidebar from "./Sidebar";

export default function Platform() {
  const authContext = useAuth()
  const { authToken, currentUser, storeAuth } = authContext;

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
        <Outlet context={authContext} />
      </main>
    </div>
  )
}
