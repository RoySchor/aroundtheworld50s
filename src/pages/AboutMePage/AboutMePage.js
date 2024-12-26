import React from "react";
import "./aboutMePage.css";
import aboutMeImage from "../../assets/about_me_page_image.png";

const AboutMePage = () => {
  return (
    <div className="page-container">
      <div className="section-container">
        <div className="top-section-container">
          <img src={aboutMeImage} alt="About Me" className="image-container" />

          <div className="overlap-text-container-box">
            <h1 className="overlap-text-container-box-title ">Hey There</h1>
            <p className="overlap-text-container-box-description">
              This is your About Page. It’s a great opportunity to give a full
              background on who you are, what you do, and what your website has
              to offer. Double click on the text box to start editing your
              content and make sure to add all the relevant details you want to
              share with site visitors.
            </p>
          </div>
        </div>
      </div>

      <div className="section-container">
        <div className="bottom-section-container">
          <h2 className="bottom-section-container-title">All About Me</h2>
          <p className="bottom-section-container-description">
            This is your About Page. This space is a great opportunity to give a
            full background on who you are, what you do, and what your site has
            to offer. Your users are genuinely interested in learning more about
            you, so don’t be afraid to share personal anecdotes to create a more
            friendly quality.
          </p>
          <p className="bottom-section-container-description">
            Every website has a story, and your visitors want to hear yours.
            This space is a great opportunity to provide any personal details
            you want to share with your followers. Include interesting anecdotes
            and facts to keep readers engaged.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutMePage;
