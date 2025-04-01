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
        <div className="mobile-nav">
          <Link to="/" className="navbar-logo">
            <img src={siteLogo} alt="Logo" className="logo" />
          </Link>
          <button onClick={toggleMenu} className="mobile-menu-button">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <div className="desktop-nav">
          <div className="nav-links-left">
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

          <div className="nav-links-right">
            <Link to="/blog" className="nav-link">
              BLOG
            </Link>
            <Link to="/special-pop-ups" className="nav-link">
              SPECIALS / POP-UPS
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

        {menuOpen && (
          <div className="mobile-menu">
            <Link to="/" className="mobile-nav-link" onClick={toggleMenu}>
              HOME
            </Link>
            <Link to="/about" className="mobile-nav-link" onClick={toggleMenu}>
              ABOUT ME
            </Link>
            <Link to="/destinations" className="mobile-nav-link" onClick={toggleMenu}>
              DESTINATIONS
            </Link>
            <Link to="/blog" className="mobile-nav-link" onClick={toggleMenu}>
              BLOG
            </Link>
            <Link to="/special-pop-ups" className="mobile-nav-link" onClick={toggleMenu}>
              SPECIALS / POP-UPS
            </Link>
            <Link to="/tips" className="mobile-nav-link" onClick={toggleMenu}>
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
        )}
      </div>
    </nav>
  );
};

export default Navbar;
