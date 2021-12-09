import React from "react";
import { Outlet } from "react-router";
import { Link } from "react-router-dom";

export default function Platform() {
  return (
    <div className="min-h-full">
      <Sidebar />
      <main className="ml-40">
        <div className="container p-2 mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  
  )
}

function Sidebar() {
  let links = [
    ["", "Feed"],
    ["events", "Events"],
    ["directory", "Members"],
  ]

  return (
    <nav className="w-32 fixed bg-gray-100 h-full">
      {links.map(([url, name], ix) => <Link key={ix} to={url} className="block m-1 p-2 text-sm rounded hover:bg-gray-300">{name}</Link>)}
    </nav>
  )
}