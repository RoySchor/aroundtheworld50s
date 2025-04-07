import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/layout.css";
import "./DestinationsPage.css";
import background from "../../assets/destinations-page-bg.jpg";
import WorldMap from "./components/WorldMap";
import blogs from "../../data/blogs";
import { serializeLocation } from "./DestinationPage.utils";

const DestinationsPage = () => {
  const navigate = useNavigate();
  const uniqueCountries = [...new Set(blogs.map((blog) => blog.country))];

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
            Choose your destinations
          </div>
        </div>
      </div>

      <div className="container">
        <div className="dropdown-container">
          <select
            className="destination-dropdown"
            onChange={(e) => {
              if (e.target.value) {
                const serializedCountry = serializeLocation(e.target.value);
                navigate(`/blog/${serializedCountry}`);
              }
            }}
          >
            <option value="">Destinations</option>
            {uniqueCountries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
        <div className="page-content">
          <WorldMap />
        </div>
      </div>
    </div>
  );
};

export default DestinationsPage;
