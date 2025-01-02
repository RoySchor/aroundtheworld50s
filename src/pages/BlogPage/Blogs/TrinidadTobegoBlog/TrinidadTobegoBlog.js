import React from "react";
import "../../BlogPage.css";
import background from "../../../../assets/trinidadTobagoBlog/trinidad-tobego-blog-bg.jpg";

const TrinidadTobegoBlog = () => {
  return (
    <div className="page-container">
      <div
        className="fixed-background-container"
        style={{
          backgroundImage: `url(${background})`,
        }}
      >
        <div className="background-configure" />

        <div className="fixed-background-text-container">
          <p className="fixed-background-title">
            EXPLORE WITH EMOTION.
            <br />
            <br />
            LIVE FOR THE JOURNEY.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="page-content">
          <h1 className="page-title">Blog</h1>
        </div>
      </div>
    </div>
  );
};

export default TrinidadTobegoBlog;
