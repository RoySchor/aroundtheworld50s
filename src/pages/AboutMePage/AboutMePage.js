import React from "react";
import "./aboutMePage.css";
import aboutMeImage from "../../assets/about-me-page-bg.webp";

const AboutMePage = () => {
  return (
    <div className="page-container about-me">
      <div className="section-container">
        <div className="top-section-container">
          <img src={aboutMeImage} alt="About Me" className="image-container" />

          <div className="overlap-text-container-box">
            <h1 className="overlap-text-container-box-title ">
              Travel with us!
            </h1>
            <p className="overlap-text-container-box-description">
              As a couple in our 50s, we've embarked on countless adventures as
              a duo and sometimes with our grown sons. We've had the privilege
              of exploring many destinations. We're passionate about sharing our
              experiences through detailed itineraries, honest tips and reviews,
              along with breathtaking photography. Whether you're a seasoned
              traveler or a first-time explorer, we're here to inspire and guide
              you on your next adventure.
            </p>
          </div>
        </div>
      </div>

      <div className="section-container">
        <div className="bottom-section-container">
          <h2 className="bottom-section-container-title">All About Me</h2>
          <p className="bottom-section-container-description">
            Join us as we uncover hidden gems, immerse ourselves in diverse
            cultures, and savor the world's beauty. Planning a trip can be
            overwhelming. Scrolling through countless reviews and videos can
            leave you feeling lost and trying to figure out where to start.
          </p>
          <p className="bottom-section-container-description">
            Let us leverage our experience to help you plan a seamless and
            unforgettable trip. You can minimize stress and maximize enjoyment
            with our insider tips and expert advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutMePage;
