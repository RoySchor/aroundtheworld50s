import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import "./navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-title">
            Aroundtheworld50s
          </Link>
        </div>

        <div className="nav-links">
          <div className="nav-links-container">
            <Link to="/" className="nav-link">
              HOME
            </Link>
            <Link to="/about" className="nav-link">
              ABOUT ME
            </Link>
            <Link to="/contact" className="nav-link">
              CONTACT
            </Link>
            <Link to="/blog" className="nav-link">
              BLOG
            </Link>
            <Link to="/gallery" className="nav-link">
              GALLERY
            </Link>
            <Link to="/tips" className="nav-link">
              TIPS I WISH I KNEW
            </Link>
          </div>
        </div>

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
    </nav>
  );
};

export default Navbar;
