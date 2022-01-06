import React from "react";
import { Outlet, Link } from "react-router-dom";

import { User } from "../models";
import { useAuth } from "./Layout";
import Login from "./Login";

export default function Platform() {
  const { authToken, currentUser, storeAuth } = useAuth();

  return (
    (authToken && currentUser)
    ?
    <div className="min-h-screen container flex">
      <div className="w-32 flex-none grow bg-gray-100">
        <Sidebar user={currentUser} />
      </div>
      <main className="ml-5 flex-auto w-full my-3">
        <Outlet context={{currentUser, authToken}} />
      </main>
    </div>
    : <Login setAuthToken={storeAuth}/>
  
  )
}

interface SidebarProps {
  user: User,
}

function Sidebar({user}: SidebarProps) {
  const linkStyles = "block mx-1 p-2 text-sm rounded hover:bg-gray-300"

  return (
    <nav className="py-1">
      <Link to="" className={linkStyles}>Feed</Link>
      <Link to="events" className={linkStyles}>Events</Link>
      <Link to="members" className={linkStyles}>Members</Link>
    </nav>
  )
}