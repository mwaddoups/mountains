import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="text-gray-600 z-40 bg-white">
      <div className="w-full md:flex mx-auto px-5 py-8">
        <span className="font-semibold text-xl tracking-tight text-gray-900">
          Clyde Mountaineering Club
        </span>
        <p className="text-sm text-gray-500 ml-4 md:border-l-2 pl-4">© {(new Date().getFullYear()).toString()} Clyde Mountaineering Club</p>
        <p className="text-sm text-gray-500 ml-4 pl-4 hover:text-gray-900"> <Link to="/privacy">Privacy Policy</Link></p>
        <p className="text-sm text-gray-500 ml-4 pl-4 hover:text-gray-900"> <a href="https://docs.google.com/document/d/12y7KK8AHyI9p4zL7Bg-mnh6KbiG5zKf1FIBVHhyxZds/edit?usp=sharing">Constitution</a></p>
      </div>


    </footer>
  )
}