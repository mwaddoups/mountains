import React, { useCallback, useEffect, useState } from "react";
import { Outlet, Link, useOutletContext } from "react-router-dom";
import api from "../api";

import { User } from "../models";
import Login from "./Login";

type AuthContext = { 
  authToken: string,
  currentUser: User,
}

export default function Platform() {
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const storeAuth = useCallback(token => {
    console.log('Storing authorization token...')
    localStorage.setItem('token', token);
    setAuthToken(token);
  }, [setAuthToken])

  useEffect(() => {
    api.get('users/self').then(res => setCurrentUser(res.data))
    // This does depend on authtoken, but it's fairly implicit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken])

  return (
    (authToken && currentUser)
    ?
    <div className="min-h-screen container flex">
      <div className="min-w-32 flex-none">
        <Sidebar user={currentUser} />
      </div>
      <main className="ml-5 flex-auto w-full">
        <Outlet context={{currentUser, authToken}} />
      </main>
    </div>
    : <Login setAuthToken={storeAuth}/>
  
  )
}

export function useAuth() {
  return useOutletContext<AuthContext>();
}

interface SidebarProps {
  user: User,
}

function Sidebar({user}: SidebarProps) {
  const linkStyles = "block mx-1 p-2 text-sm rounded hover:bg-gray-300"

  return (
    <nav className="bg-gray-100 py-1">
      <Link to={`members/${user.id}`} className={linkStyles}>{user.first_name} {user.last_name}</Link>
      <Link to="" className={linkStyles}>Feed</Link>
      <Link to="events" className={linkStyles}>Events</Link>
      <Link to="members" className={linkStyles}>Members</Link>
    </nav>
  )
}