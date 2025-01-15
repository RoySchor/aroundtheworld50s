import React from "react";
import "./aboutMePage.css";
import aboutMeImage from "../../assets/about-me-page-bg.webp";

const AboutMePage = () => {
  return (
    <div className="page-container about-me">
      <div className="about-me-section-container">
        <div className="about-me-top-section-container">
          <img
            src={aboutMeImage}
            alt="About Me"
            className="about-me-image-container"
          />

          <div className="overlap-text-container-box">
            <h1 className="overlap-text-container-box-title ">
              A Journey of Growth
            </h1>
            <p className="overlap-text-container-box-description">
              Our love for travel has evolved over the years, long before the
              age of smartphones. We remember those early days of planning trips
              with paper maps and Mapquest, meticulously plotting our routes.
              From those humble beginnings, we've embraced the evolution of
              travel planning, incorporating GPS, travel apps, and even AI.
            </p>
          </div>
        </div>
      </div>

      <div className="about-me-section-container">
        <div className="about-me-bottom-section-container">
          <h2 className="about-me-bottom-section-container-title">
            What We're All About
          </h2>
          <p className="about-me-bottom-section-container-description">
            From family road trips with our children to spontaneous city
            escapes. Even when not traveling, we constantly explore and discover
            hidden gems in our NYC neighborhoods. We explore hidden corners
            every weekend, seeking unique experiences and off-the-beaten-path
            adventures. Believe me, there's always something new to discover in
            this vibrant city! You'll find us sharing our travel adventures
            alongside unique city experiences – the unexpected encounters, the
            hidden cafes, and the off-the-beaten-path discoveries that make
            travel truly special.
          </p>
          <p className="about-me-bottom-section-container-description">
            We're passionate about sharing our travel experiences with you, from
            epic family adventures like dog sledding in the Canadian wilderness
            and living on a houseboat for a couple of weeks to the simple joy of
            discovering a charming cafe on a quiet Manhattan street. Join us as
            we explore the world, one adventure at a time. I love to take
            photos, and I'll be sharing my photos and videos alongside our
            travel stories and city explorations right here on the blog and on
            my Instagram and TikTok. Follow along as we capture the essence of
            each journey through our lens.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutMePage;
