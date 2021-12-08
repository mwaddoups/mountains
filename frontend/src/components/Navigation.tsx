import React from "react";
import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <nav className="flex items-center p-6 border-b-4 text-gray-900">
      <div className="mr-12">
        <span className="font-semibold text-xl tracking-tight">
          Clyde Mountaineering Club
        </span>
      </div>
      <ul>
        <li className="mr-6 inline-block">
          <Link to="/" className="hover:text-blue-300">Home</Link>
        </li>
        <li className="mr-6 inline-block">
          <Link to="/members" className="hover:text-blue-300">Members Area</Link>
        </li>
      </ul>
    </nav>
  )
}