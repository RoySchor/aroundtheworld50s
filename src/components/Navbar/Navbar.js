import React from "react";
import "./navbar.css";
import { Link, useLocation } from "react-router-dom";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import siteLogo from "../../assets/around_the_world_50s_logo.png";

const Navbar = () => {
  const location = useLocation();
  const isHomePage =
    location.pathname === "/" || location.pathname === "/destinations";

  return (
    <nav
      className={`navbar ${isHomePage ? "navbar-transparent" : "navbar-light"}`}
    >
      <div className="navbar-container">
        <div className="nav-links-container">
          <Link to="/" className="nav-link">
            HOME
          </Link>
          <Link to="/about" className="nav-link">
            ABOUT ME
          </Link>
          <Link to="/destinations" className="nav-link">
            DESTINATIONS
          </Link>
          <Link to="/blog" className="nav-link">
            BLOG
          </Link>
        </div>

        <div className="navbar-logo">
          <Link to="/">
            <img
              src={siteLogo}
              alt="Around the World 50s Logo"
              className="logo"
            />
          </Link>
        </div>

        <div className="nav-links-container">
          <Link to="/special-pop-ups" className="nav-link">
            SPECIALS/ POP-UPS
          </Link>
          <Link to="/tips" className="nav-link">
            TIPS
          </Link>
          <div className="social-links">
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
    </nav>
  );
};

export default Navbar;
