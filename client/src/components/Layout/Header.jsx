import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";
import Icon from "../../Images/Icon.png";
import { useAuth } from "../../context/UserContext";
import toast from "react-hot-toast";
import { FaUser } from "react-icons/fa";

const Header = () => {
  // States
  const [isOpen, setIsOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [auth, setAuth] = useAuth();

  // Logout
  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
  };

  // To Display name of the user if exists
  useEffect(() => {
    const isUser = JSON.parse(localStorage.getItem("auth"));
    if (isUser) {
      setLoginUser(isUser.user);
    }
  }, []);

  // Dropdown Toggle
  const toggleDropdown = () => {
    setDropOpen(!dropOpen);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between flex-wrap p-3 bg-slate-700 shadow-md ">
        <div className="flex items-center flex-shrink-0 text-white mr-6 lg:mr-72">
          <img src={Icon} className="w-100 h-10 mr-2" alt="Logo" />
        </div>
        <div className="block lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center px-3 py-2 rounded text-black-500 hover:text-black-400"
          >
            {isOpen ? <MdClose size={30} /> : <GiHamburgerMenu size={30} />}
          </button>
        </div>
        <div
          className={`w-full flex justify-end items-center flex-grow lg:flex lg:items-center lg:w-auto lg:justify-center ${
            isOpen ? "block" : "hidden"
          }`}
        >
          {!auth.user ? (
            <div className="lg:text-lg font-bold lg:mx-auto lg:mr-0 lg:rounded-md lg:flex lg:justify-end">
              <NavLink
                to="/register"
                className="block text-white hover:text-gray-300 lg:pr-5 lg:pl-5 lg:inline-block lg:mt-0  lg:ml-4 "
              >
                Register
              </NavLink>
              <NavLink
                to="/login"
                className="block mt-4 lg:inline-block hover:text-gray-300 lg:pl-5 lg:pr-5 lg:mt-0 text-white mr-4"
              >
                Login
              </NavLink>
            </div>
          ) : (
            <>
              <div className="relative lg:mx-auto lg:mr-0 lg:rounded-md lg:flex lg:justify-end">
                <button
                  onClick={toggleDropdown}
                  className=" px-4 flex items-center border  text-blue-500 rounded-md focus:outline-none font-semibold"
                >
                  <FaUser className="pr-2" size={30} />
                  <p className="pt-3">{loginUser && loginUser.name}</p>
                </button>
                {dropOpen && (
                  <div className="absolute lg:mt-14 w-40 bg-slate-500 rounded-md shadow-lg z-10 ">
                    <NavLink
                      className={
                        "block px-4 py-2 text-white hover:bg-slate-700 w-full text-left"
                      }
                      to="/dashboard/account-page"
                    >
                      Account
                    </NavLink>

                    <NavLink
                      to="/login"
                      onClick={handleLogout}
                      className="block px-4 py-2 text-white hover:bg-slate-700 w-full text-left"
                    >
                      Logout
                    </NavLink>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;
