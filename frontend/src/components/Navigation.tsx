import React from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../models";

interface NavigationProps {
  authContext: AuthContext,
}

export default function Navigation({ authContext }: NavigationProps) {
  const {currentUser, logout} = authContext;

  const linkStyles = "h-full p-4 hover:bg-gray-200";

  return (
    <nav className="container flex items-center border-b-4 text-gray-900 bg-white sticky h-16">
      <div className="h-full p-4 ml-4 mr-12">
        <span className="font-semibold text-xl tracking-tight">
          Clyde Mountaineering Club
        </span>
      </div>
      <Link to="/" className={linkStyles}>Home</Link>
      <Link to="/platform" className={linkStyles}>Members Area</Link>
      {currentUser && (
        <>
        <Link to={`/platform/members/${currentUser.id}`} className={linkStyles + " ml-auto"}>{currentUser.first_name} {currentUser.last_name}</Link>
        <Link to="/" onClick={logout} className={linkStyles}>Logout</Link>
        </>
      )}

    </nav>
  )
}