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

      <div className="home-page-section-container">
        <h2 className="home-page-section-container-title">Travel With Us!</h2>
        <p className="home-page-section-container-description">
          As a couple in our 50s, we've embarked on countless adventures as a
          duo and sometimes with our grown sons. We've had the privilege of
          exploring many destinations. We're passionate about sharing our
          experiences through detailed itineraries, honest tips and reviews, and
          breathtaking photography. Whether you're a seasoned traveler or a
          first-time explorer, we're here to inspire and guide you on your next
          adventure.
        </p>
        <p className="home-page-section-container-description">
          Join us as we uncover hidden gems, immerse ourselves in diverse
          cultures, and savor the world's beauty. Planning a trip can be
          overwhelming. Scrolling through countless reviews and videos can leave
          you feeling lost and trying to figure out where to start. Let us
          leverage our experience to help you plan a seamless and unforgettable
          trip. You can minimize stress and maximize enjoyment with our insider
          tips and expert advice.
        </p>
      </div>

      <MostRecentPosts />

      <RotatingGallery />
    </div>
  );
};

export default HomePage;
