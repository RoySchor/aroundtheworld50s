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

  // Helper function to check if country is US
  const isUSCountry = (country) => {
    const normalizedCountry = country.toLowerCase().trim();
    const usVariants = [
      "us",
      "usa",
      "united states",
      "united states of america",
      "america",
      "u.s.",
      "u.s.a.",
      "u.s.a",
    ];
    return usVariants.includes(normalizedCountry);
  };

  // Create unique locations (countries and US states)
  const uniqueLocations = Object.values(
    blogs.reduce((accumulator, blog) => {
      let locationKey, displayName, path;

      if (blog.state && isUSCountry(blog.country)) {
        locationKey = `USA-${blog.state}`;
        displayName = `${blog.state}, USA`;
        path = blog.path.replace(/\/\d+$/, ""); // Remove post number
      } else {
        locationKey = blog.country;
        displayName = blog.country;
        path = `/blog/${serializeLocation(blog.country)}`;
      }

      if (!accumulator[locationKey]) {
        accumulator[locationKey] = { displayName, path };
      }
      return accumulator;
    }, {}),
  );

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
                navigate(e.target.value);
              }
            }}
          >
            <option value="">Destinations</option>
            {uniqueLocations.map((location, index) => (
              <option key={index} value={location.path}>
                {location.displayName}
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
