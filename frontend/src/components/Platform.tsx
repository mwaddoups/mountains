import React, { useCallback, useState } from "react";
import { Outlet, Link, useOutletContext } from "react-router-dom";

import Login from "./Login";

type AuthContext = { authToken: string | null }

export default function Platform() {
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('token'));

  const storeAuth = useCallback(token => {
    console.log('Storing authorization token...')
    localStorage.setItem('token', token);
    setAuthToken(token);
  }, [setAuthToken])

  return (
    authToken 
    ?
    <div className="min-h-full">
      <Sidebar />
      <main className="ml-40">
        <div className="container p-2 mx-auto">
          <Outlet context={{authToken}} />
        </div>
      </main>
    </div>
    : <Login setAuthToken={storeAuth}/>
  
  )
}

export function useAuth() {
  return useOutletContext<AuthContext>();
}

function Sidebar() {
  let links = [
    ["", "Feed"],
    ["events", "Events"],
    ["members", "Members"],
  ]

  return (
    <nav className="w-32 fixed bg-gray-100 h-full">
      {links.map(([url, name], ix) => <Link key={ix} to={url} className="block m-1 p-2 text-sm rounded hover:bg-gray-300">{name}</Link>)}
    </nav>
  )
}