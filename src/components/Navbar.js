import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";
import "../styles/navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
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
              href="https://instagram.com/dummy"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="social-icon" />
            </a>
            <a
              href="https://github.com/dummy"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="social-icon" />
            </a>
            <a
              href="https://linkedin.com/in/dummy"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className="social-icon" />
            </a>
            <a href="https://royschor.com" className="nav-link">
              ROYSCHOR.COM
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
