import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="text-gray-600 z-40 bg-white">
      <div className="container flex mx-auto px-5 py-8">
        <span className="font-semibold text-xl tracking-tight text-gray-900">
          Clyde Mountaineering Club
        </span>
        <p className="text-sm text-gray-500 ml-4 border-l-2 pl-4">© {(new Date().getFullYear()).toString()} Clyde Mountaineering Club</p>
        <p className="text-sm text-gray-500 ml-4 pl-4 hover:text-gray-900"> <Link to="/privacy">Privacy Policy</Link></p>
      </div>


    </footer>
  )
}