import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";


const Nav = () => {
  return (
    <div>
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to={"/"} className="text-xl font-bold">Movie Madness</Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Nav;
