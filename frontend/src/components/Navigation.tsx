import React, { useEffect, useState } from "react";
import { BoxArrowRight, List } from "react-bootstrap-icons";
import { Link, useLocation } from "react-router-dom";
import { getName } from "../methods/user";
import { AuthContext } from "../models";
import ProfilePicture from "./members/ProfilePicture";

interface NavigationProps {
  authContext: AuthContext,
}

export default function Navigation({ authContext }: NavigationProps) {
  const [menuOpenMobile, setMenuOpenMobile] = useState(false);
  const {currentUser, logout} = authContext;

  // Collapse the menu on navigation
  const location = useLocation();
  useEffect(() => setMenuOpenMobile(false), [location])


  const linkStyles = "block h-full py-4 px-2.5 hover:bg-gray-200 flex-none";

  // Remember! If you are adding new links, you need to update the max-h- transition.
  // Currently it is 28 REM = 6 links + 1 logo = 7 * 4REM
  return (
    <nav className={(
      "w-full lg:flex lg:sticky lg:items-center border-b-4 text-gray-900 bg-white lg:h-16 border-teal-600 overflow-hidden transition-[max-height]"
      + (menuOpenMobile ? " max-h-[28rem]" : " max-h-16")
    )}>
      <div className="h-full p-4 flex-none flex w-full lg:w-auto">
        <span className="font-semibold text-xl tracking-tight truncate">
         <span className="bg-logo bg-cover bg-no-repeat pr-12 mr-2"></span> 
         Clyde Mountaineering Club
        </span>

        <button onClick={() => setMenuOpenMobile(!menuOpenMobile)} className="ml-auto border rounded-lg lg:hidden "><List /></button>
      </div>
      <Link to="/" className={linkStyles}>Home</Link>
      <Link to="/faq" className={linkStyles}>FAQs</Link>
      <Link to="/committee" className={linkStyles}>Committee</Link>
      <Link to="/platform" className={linkStyles}>Members Area</Link>
      {currentUser && (
        <>
        <Link to={`/platform/members/${currentUser.id}`} className={linkStyles + " lg:ml-auto flex"}>
          <span className="mr-2">{getName(currentUser)}</span>
          <div className="w-7 h-7"><ProfilePicture user={currentUser} /></div>
        </Link>
        <Link to="/" onClick={logout} className={linkStyles + " flex items-center"}><BoxArrowRight /></Link>
        </>
    )}
    </nav>
  )
}