/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Nav = ({ user }) => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3000/logout", {
        withCredentials: true,
      });
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-[#19b394] p-4">
      {/*  */}
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex gap-5">
          <div className="md:hidden flex items-start">
            <button onClick={toggleMenu} className="text-white">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
          {/* Logo or Brand */}
          <Link
            to="/"
            className="text-white font-bold text- font-mono text-[19px]"
          >
            Scholarship Portal
          </Link>

          {/* Menu Links - Hidden on Mobile */}
          <div className="hidden md:flex space-x-4 ">
            <Link to="/ " className="text-white text-base font-semibold">
              Home
            </Link>
            <Link
              to="/survey-form"
              className="text-white text-base font-semibold"
            >
              Survey Form
            </Link>
            <Link to="/login " className="text-white text-base font-semibold">
              Login
            </Link>
          </div>
        </div>

        {/* Hamburger Icon for Mobile */}

        <div className="relative">
          <img
            src="/ac_white.svg"
            onClick={toggleDropdown}
            className="cursor-pointer"
            alt="Profile"
          />
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 ">
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu - Shown only on Mobile */}
      {isOpen && (
        <div className="md:hidden mt-2 px-2 pt-2 pb-3 space-y-1 ">
          <Link to="/home" className="block text-white text-lg font-semibold">
            Home
          </Link>
          <Link
            to="/survey-form"
            className="block text-white text-lg font-semibold"
          >
            Survey Form
          </Link>
          <Link to="/login" className="block text-white text-lg font-semibold">
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Nav;
