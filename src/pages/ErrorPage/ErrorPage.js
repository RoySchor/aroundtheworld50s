import React from "react";
import "../../styles/layout.css";
import "./ErrorPage.css";
import errorGif from "../../assets/error-page-gif-no-bg.gif";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="page-container">
      <div className="container">
        <div className="page-content">
          <Link to="/" className="nav-link">
            <img src={errorGif} alt="Error Page" className="error-gif" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
