import React from "react";
import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <nav className="container flex items-center border-b-4 text-gray-900 bg-white fixed h-16">
      <div className="h-full p-4 ml-4 mr-12">
        <span className="font-semibold text-xl tracking-tight">
          Clyde Mountaineering Club
        </span>
      </div>
      <Link to="/" className="h-full p-4 hover:bg-gray-200">Home</Link>
      <Link to="/members" className="h-full p-4 hover:bg-gray-200">Members Area</Link>
    </nav>
  )
}