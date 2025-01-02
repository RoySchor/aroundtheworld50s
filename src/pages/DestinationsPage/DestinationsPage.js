import React from "react";
import "../../styles/layout.css";
import "./DestinationsPage.css";
import background from "../../assets/destinations-page-bg.jpg";
import worldMap from "../../assets/flat-world-map.webp";

const DestinationsPage = () => {
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
          Choose your destinations
        </div>
      </div>

      <div className="container">
        <div className="page-content">
          <img src={worldMap} alt="world map" className="world-map" />
        </div>
      </div>
    </div>
  );
};

export default DestinationsPage;
