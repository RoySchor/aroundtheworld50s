import React from "react";
import "../../styles/layout.css";
import "./HomePage.css";
import background1 from "../../assets/home-page-bg.webp";
import { Link } from "react-router-dom";
import RotatingGallery from "./components/RotatingGallery";

const HomePage = () => {
  return (
    <div className="page-container">
      <div
        className="fixed-background-container"
        style={{
          backgroundImage: `url(${background1})`,
        }}
      >
        <div className="background-configure" />

        <div className="fixed-background-text-container">
          <p className="fixed-background-subtitle">
            EXPLORE WITH EMOTION.
            <br />
            <br />
            LIVE FOR THE JOURNEY.
          </p>
          <button className="fixed-background-button">
            <Link to="/about">WHO AM I?</Link>
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
