import React, { useState } from "react";
import "./navbar.css";
import { Link, useLocation } from "react-router-dom";
import { FaInstagram, FaTiktok, FaBars, FaTimes } from "react-icons/fa";
import siteLogo from "../../assets/around_the_world_50s_logo.png";

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const transparentNavBar =
    location.pathname === "/" ||
    location.pathname === "/destinations" ||
    location.pathname.startsWith("/blog/");

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <nav
      className={`navbar ${transparentNavBar ? "navbar-transparent" : "navbar-light"}`}
    >
      <div className="navbar-container">
        <div className="lg:hidden flex">
          <Link to="/" className="navbar-logo">
            <img src={siteLogo} alt="Logo" className="logo" />
          </Link>
          <button onClick={toggleMenu} className="text-white text-3xl">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <div className="hidden lg:flex items-center justify-between w-full">
          <div className="flex space-x-6">
            <Link to="/" className="nav-link">
              HOME
            </Link>
            <Link to="/about" className="nav-link">
              ABOUT ME
            </Link>
            <Link to="/destinations" className="nav-link">
              DESTINATIONS
            </Link>
          </div>

          <div className="navbar-logo">
            <Link to="/">
              <img src={siteLogo} alt="Logo" className="logo" />
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/blog" className="nav-link">
              BLOG
            </Link>
            <Link to="/special-pop-ups" className="nav-link">
              SPECIALS / POP-UPS
            </Link>
            <Link to="/tips" className="nav-link">
              TIPS
            </Link>
            <div className="social-links flex space-x-4">
              <a
                href="https://www.instagram.com/aroundtheworld50s/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="social-icon" />
              </a>
              <a
                href="https://www.tiktok.com/@aroundtheworld50s"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTiktok className="social-icon" />
              </a>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden w-full mt-4 space-y-4 text-center">
            <Link to="/" className="nav-link block" onClick={toggleMenu}>
              HOME
            </Link>
            <Link to="/about" className="nav-link block" onClick={toggleMenu}>
              ABOUT ME
            </Link>
            <Link
              to="/destinations"
              className="nav-link block"
              onClick={toggleMenu}
            >
              DESTINATIONS
            </Link>
            <Link to="/blog" className="nav-link block" onClick={toggleMenu}>
              BLOG
            </Link>
            <Link
              to="/special-pop-ups"
              className="nav-link block"
              onClick={toggleMenu}
            >
              SPECIALS / POP-UPS
            </Link>
            <Link to="/tips" className="nav-link block" onClick={toggleMenu}>
              TIPS
            </Link>
            <div className="flex justify-center space-x-4">
              <a
                href="https://www.instagram.com/aroundtheworld50s/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="social-icon" />
              </a>
              <a
                href="https://www.tiktok.com/@aroundtheworld50s"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTiktok className="social-icon" />
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
