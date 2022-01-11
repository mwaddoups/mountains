import React from "react";
import { Calendar, House, Newspaper, PeopleFill } from "react-bootstrap-icons";
import { Outlet, NavLink } from "react-router-dom";

import { useAuth } from "./Layout";
import Login from "./Login";
import ProfileEditor from "./members/ProfileEditor";

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
      <div className="w-32 flex-none grow bg-teal-600 text-gray-100">
        <Sidebar />
      </div>
      <main className="ml-5 flex-auto w-full my-3">
        <Outlet context={authContext} />
      </main>
    </div>
  )
}

function Sidebar() {
  const linkStyles = "block mx-1 p-2 text-sm rounded hover:bg-teal-800";
  const linkStyler = ({isActive}: any) => isActive ? linkStyles + " bg-teal-700" : linkStyles;

  return (
    <nav className="py-1">
      <NavLink end to="." className={linkStyler}>
        <span className="flex"><House className="h-6 w-6 mr-3" />Home</span>
      </NavLink>
      <NavLink end to="feed" className={linkStyler}>
        <span className="flex"><Newspaper className="h-6 w-6 mr-3" />Feed</span>
      </NavLink>
      <NavLink to="events" className={linkStyler}>
        <span className="flex"><Calendar className="h-6 w-6 mr-3" />Events</span>
      </NavLink>
      <NavLink to="members" className={linkStyler}>
        <span className="flex"><PeopleFill className="h-6 w-6 mr-3" />Members</span>
      </NavLink>
      <div className="mt-20"></div>
    </nav>
  )
}