import React from "react";
import "../../../../styles/layout.css";
import "../BlogPost.css";
import background from "../../../../assets/blog/TrinidadTobagoPost1/trinidad-tobego-post-1-bg.jpg";

const TrinidadTobegoPost1 = () => {
  return (
    <div className="page-container">
      <div
        className="fixed-background-container"
        style={{
          backgroundImage: `url(${background})`,
        }}
      >
        <div className="fixed-background-text-container">
          <div className="fixed-background-title fixed-background-no-margin">
            📍🇹🇹Trinidad & Tobago, a tale of 2 islands
          </div>
        </div>
      </div>

      <div className="container">
        <div className="page-content">
          <div className="post-title">
            ⛱️10 days of Caribbean Charm: Uncovering the Soul and beaches✨
          </div>
          <div className="post-description">
            Our 📍
            <a
              href="https://en.wikipedia.org/wiki/Trinidad"
              target="_blank"
              className="post-link"
              rel="noreferrer"
            >
              Trinidad & Tobago
            </a>{" "}
            adventure was a spur-of-the-moment decision. When our cruise was
            unexpectedly rerouted (due to a hurricane), we decided to embrace
            the unexpected and plan a last-minute island getaway. The idea of
            exploring these vibrant twin islands, fueled by my husband's
            friend's glowing descriptions of the culture and beaches, quickly
            took hold. And so, our Caribbean escape began.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrinidadTobegoPost1;
