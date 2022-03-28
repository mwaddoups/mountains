import React from "react";
import { Binoculars, Calendar, Discord, House, Images, ListCheck, PeopleFill } from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";
import { useAuth } from "./Layout";


export default function Sidebar() {
  const linkStyles = "block mx-1 py-2 sm:px-2 text-sm rounded hover:bg-teal-800 text-center";
  const linkStyler = ({isActive}: any) => isActive ? linkStyles + " bg-teal-700" : linkStyles;

  const iconStyles = "h-6 w-6 mx-auto mb-1 sm:mr-3 sm:ml-0 sm:mb-0";
  
  const { currentUser } = useAuth();

  return (
    <nav className="py-1">
      <NavLink end to="." className={linkStyler}>
        <span className="sm:flex"><House className={iconStyles} />Home</span>
      </NavLink>
      <NavLink to="events" className={linkStyler}>
        <span className="sm:flex"><Calendar className={iconStyles} />Events</span>
      </NavLink>
      <NavLink to="members" className={linkStyler}>
        <span className="sm:flex"><PeopleFill className={iconStyles} />Members</span>
      </NavLink>
      <NavLink to="photos" className={linkStyler}>
        <span className="sm:flex"><Images className={iconStyles} />Photos</span>
      </NavLink>
      <NavLink to="kitlist" className={linkStyler}>
        <span className="sm:flex"><ListCheck className={iconStyles} />Kit List</span>
      </NavLink>
      {currentUser?.is_committee && 
        <NavLink to="committee" className={linkStyler}>
          <span className="sm:flex"><Binoculars className={iconStyles} />Committee</span>
        </NavLink>
      }
      <a target="_blank" rel="noreferrer" className={linkStyles} 
        href="https://discord.gg/98K3CafRxk">
        <span className="sm:flex"><Discord className={iconStyles} />Discord</span>
      </a>
      <div className="mt-20"></div>
    </nav>
  )
}