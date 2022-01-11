import React from "react";
import { Link } from "react-router-dom";
import { getName } from "../methods/user";
import { AuthContext } from "../models";
import ProfilePicture from "./members/ProfilePicture";

interface NavigationProps {
  authContext: AuthContext,
}

export default function Navigation({ authContext }: NavigationProps) {
  const {currentUser, logout} = authContext;

  const linkStyles = "h-full p-4 hover:bg-gray-200";

  return (
    <nav className="container flex items-center border-b-4 text-gray-900 bg-white sticky h-16 border-teal-600">
      <div className="h-full p-4 ml-2 mr-12">
        <span className="font-semibold text-xl tracking-tight">
         <span role='img' aria-label="mountain">⛰️</span> Clyde Mountaineering Club
        </span>
      </div>
      <Link to="/" className={linkStyles}>Home</Link>
      <Link to="/platform" className={linkStyles}>Members Area</Link>
      {currentUser && (
        <>
        <Link to={`/platform/members/${currentUser.id}`} className={linkStyles + " ml-auto flex"}>
          <span className="mr-2">{getName(currentUser)}</span>
          <div className="w-8 h-8"><ProfilePicture imageUrl={currentUser.profile_picture} /></div>
        </Link>
        <Link to="/" onClick={logout} className={linkStyles}>Logout</Link>
        </>
      )}

    </nav>
  )
}