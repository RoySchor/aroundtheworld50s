import React from "react";
import "../../styles/layout.css";
import "./HomePage.css";
import background from "../../assets/home-page-bg.webp";
import { Link } from "react-router-dom";
import MostRecentPosts from "./components/MostRecentPosts/MostRecentPosts";
import RotatingGallery from "./components/RotatingGallery/RotatingGallery";

const HomePage = () => {
  return (
    <div className="page-container">
      <div
        className="fixed-background-container"
        style={{
          backgroundImage: `url(${background})`,
        }}
      >
        <div className="fixed-background-text-container">
          <p className="fixed-background-title">
            EXPLORE WITH EMOTION.
            <br />
            <br />
            LIVE FOR THE JOURNEY.
          </p>
          <button className="home-page-fixed-background-button">
            <Link to="/about">WHO AM I?</Link>
          </button>
        </div>
      </div>

      <MostRecentPosts />

      <RotatingGallery />
    </div>
  );
};

export default HomePage;
