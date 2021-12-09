import React from "react";
import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <nav className="container flex items-center border-b-4 text-gray-900">
      <div className="ml-4 mr-12">
        <span className="font-semibold text-xl tracking-tight">
          Clyde Mountaineering Club
        </span>
      </div>
      <Link to="/" className="p-4 hover:bg-gray-200">Home</Link>
      <Link to="/members" className="p-4 hover:bg-gray-200">Members Area</Link>
    </nav>
  )
}