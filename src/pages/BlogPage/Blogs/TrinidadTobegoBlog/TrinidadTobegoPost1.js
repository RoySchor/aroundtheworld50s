import React from "react";
import "../../../../styles/layout.css";
import "../BlogPost.css";
import background from "../../../../assets/blog/trinidadTobagoPost1/trinidad-tobego-post-1-bg.jpg";

const TrinidadTobegoPost1 = () => {
  return (
    <div className="page-container">
      <div
        className="blog-post-fixed-background-container"
        style={{
          backgroundImage: `url(${background})`,
        }}
      >
        <div className="blog-post-fixed-background-text-container">
          📍🇹🇹Trinidad & Tobago, a tale of 2 islands
        </div>
      </div>

      <div className="container">
        <div className="page-content">
          <div className="post-title">
            ⛱️10 days of Caribbean Charm: Uncovering the Soul and beaches✨
          </div>
          <div className="post-description">
            Our Trinidad & Tobago adventure was a spur-of-the-moment decision.
            When our cruise was unexpectedly rerouted, we decided to embrace the
            unexpected and plan a last-minute island getaway. The idea of
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
