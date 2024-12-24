import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import main_logo from "../../assets/Logo/main_logo.png";
import { NavbarLinks } from "../../data/navbar-links";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { ACCOUNT_TYPE } from "../../utils/constants";
import ProfileDropdown from "../core/Auth/ProfileDropDown";

import ProgressBar from "./progressbar";

function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();
  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        setSubLinks(res.data.data);
      } catch (error) {
        console.error("Could not fetch Categories.", error);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  const matchRoute = (route) => location.pathname === route;

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleMouseEnter = () => setDropdownOpen(true);

  const handleMouseLeave = () => setDropdownOpen(false);

  return (
    <div className="navbarContainer sticky top-0 left-0 z-1000">
      <div className="flex items-center justify-center bg-black border-b-[1px] border-b-richblack-800">
        <div className="flex flex-col md:flex-row w-full max-w-maxContent items-center justify-between px-4 py-2">
          {/* Logo and Mobile Menu Toggle */}
          <div className="flex items-center justify-between w-full md:w-auto px-1 py-1">
            <Link to="/" onClick={closeMobileMenu}>
              <img src={main_logo} alt="Logo" width={50} height={10} loading="lazy" />
            </Link>
            <p className="text-white text-2xl">SkillSync</p>
            <button
              className="block md:hidden text-2xl text-richblack-25 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? "✖" : <AiOutlineMenu />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className={`mt-4 md:mt-0 ${mobileMenuOpen ? "block" : "hidden"} md:block`}>
            <ul className="flex flex-col md:flex-row items-center gap-y-4 md:gap-y-0 md:gap-x-14">
              {NavbarLinks.map(({ title, path }, index) => (
                <li
                  key={index}
                  className="relative mb-2 md:mb-0 transition duration-300 ease-in-out transform hover:text-yellow-25 hover:scale-105"
                >
                  {title === "Catalog" ? (
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-100 hover:text-yellow-200"
                          : "text-richblack-25 hover:text-richblack-50"
                      }`}
                      onClick={toggleDropdown}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <p>{title}</p>
                      <BsChevronDown />
                      {dropdownOpen && (
                        <div className="absolute z-[1000] flex flex-col bg-richblack-5 rounded-lg p-4 text-richblack-900">
                          {loading ? (
                            <p className="text-center">Loading...</p>
                          ) : subLinks?.length ? (
                            subLinks
                              .filter((subLink) => subLink?.courses?.length > 0)
                              .map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                                  key={i}
                                  className="py-2 hover:bg-richblack-500 rounded-md"
                                  onClick={toggleDropdown}
                                >
                                  {subLink.name}
                                </Link>
                              ))
                          ) : (
                            <p className="text-center">No Courses Found</p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link to={path} onClick={closeMobileMenu}>
                      <p
                        className={`${
                          matchRoute(path) ? "text-yellow-25" : "text-richblack-25"
                        } hover:text-yellow-25`}
                      >
                        {title}
                      </p>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Profile and Cart */}
          <div className={`${mobileMenuOpen ? "block" : "hidden"} md:block mt-2 md:mt-0`}>
            <div className="flex flex-col md:flex-row items-center gap-y-4 md:gap-y-0 md:gap-x-8">
              {user && user.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                <Link to="/dashboard/cart" className="relative" onClick={closeMobileMenu}>
                  <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                  {totalItems > 0 && (
                    <span className="absolute -bottom-2 -right-2 h-5 w-5 bg-richblack-600 text-yellow-500 rounded-full text-xs grid place-items-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}
              {!token ? (
                <div className="flex flex-col md:flex-row gap-y-4 md:gap-y-0 md:gap-x-4">
                  <Link to="/login" onClick={closeMobileMenu}>
                    <button className="rounded-md px-4 py-2 transition hover:scale-95 bg-yellow-50 text-black hover:bg-richblack-800 hover:text-white">
                      Log In
                    </button>
                  </Link>
                  <Link to="/signup" onClick={closeMobileMenu}>
                    <button className="rounded-md px-4 py-2 transition hover:scale-95 bg-blue-50 text-white hover:bg-richblack-800 hover:text-gray-200">
                      Sign Up
                    </button>
                  </Link>
                </div>
              ) : (
                <ProfileDropdown />
              )}
            </div>
          </div>
        </div>
      </div>
      <ProgressBar />
    </div>
  );
}

export default Navbar;
