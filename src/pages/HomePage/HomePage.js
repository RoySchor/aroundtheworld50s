import React from "react";
import "../../styles/layout.css";
import "./HomePage.css";
import homePageBackground from "../../assets/home_page_background_img.JPG";
import { Link } from "react-router-dom";
import RotatingGallery from "./components/RotatingGallery";

const HomePage = () => {
  return (
    <div className="page-container">
      <div
        className="fixed-background-container"
        style={{
          backgroundImage: `url(${homePageBackground})`,
        }}
      >
        <div className="background-configure" />

        <div className="fixed-background-text-container">
          <h1 className="fixed-background-title">Hi!</h1>
          <p className="fixed-background-subtitle">
            I'm just a mom traveling the world in my 50s
          </p>
          <button className="fixed-background-button">
            <Link to="/about">Get to know me</Link>
          </button>
        </div>
      </div>

      <div className="sliding-gallery-container">
        <div className="sliding-gallery-text-container">
          <h2 className="sliding-gallery-title">
            Discover. Wonder. Experience. Live.
          </h2>
        </div>

        <RotatingGallery />
      </div>
    </div>
  );
};

export default HomePage;
