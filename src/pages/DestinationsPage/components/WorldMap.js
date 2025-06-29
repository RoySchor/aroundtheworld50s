import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./WorldMap.css";
import worldMap from "../../../assets/flat-world-map.webp";
import blogs from "../../../data/blogs";
import { locationCoordinates } from "./WorldMap.constants";
import Flag from "react-world-flags";

const WorldMap = () => {
  const [hoveredLocation, setHoveredLocation] = useState(null);

  // Helper function to check if country is US
  const isUSCountry = (countryCode) => {
    return countryCode === "US";
  };

  const uniqueCountryBlogs = Object.values(
    blogs.reduce((accumulator, blog) => {
      // Create location key for coordinate lookup
      let locationKey;
      if (blog.state && isUSCountry(blog.country_code)) {
        locationKey = `USA-${blog.state}`;
      } else {
        locationKey = blog.country;
      }

      if (!accumulator[locationKey]) {
        accumulator[locationKey] = blog;
      }
      return accumulator;
    }, {}),
  );

  return (
    <div className="world-map-container">
      <img src={worldMap} alt="World Map" className="world-map" />

      {uniqueCountryBlogs.map((blog) => {
        // Create location key for coordinate lookup
        let locationKey;
        if (blog.state && isUSCountry(blog.country_code)) {
          locationKey = `USA-${blog.state}`;
        } else {
          locationKey = blog.country;
        }

        const coordinates = locationCoordinates[locationKey];
        if (!coordinates) return null;

        // Create URL using the serialized location from the blog path
        const to = blog.path.replace(/\/\d+$/, ""); // Remove the post number to get the base path

        return (
          <Link to={to} key={blog.id}>
            <div
              className="country-box-selector"
              style={{
                left: coordinates.left,
                top: coordinates.top,
                transform: "translate(-50%, -50%)",
              }}
              onMouseEnter={() => setHoveredLocation(blog)}
              onMouseLeave={() => setHoveredLocation(null)}
            >
              {hoveredLocation && hoveredLocation.id === blog.id && (
                <div className="flag-pole">
                  <div className="flag">
                    <Flag
                      code={hoveredLocation.country_code || "US"}
                      alt={hoveredLocation.country}
                    />
                  </div>
                </div>
              )}
            </div>
          </Link>
        );
      })}

      {hoveredLocation && (
        <div className="hover-info-container">
          <div className="hover-info-image-container">
            <img
              src={require(
                `../../../assets/blog/${hoveredLocation.folder}/${hoveredLocation.background_image}`,
              )}
              alt={hoveredLocation.state || hoveredLocation.country}
              className="hover-info-image"
            />
          </div>

          <div className="hover-info-country-blog-container">
            <div className="hover-info-country-blog-title">
              {hoveredLocation.state
                ? `${hoveredLocation.state}, ${hoveredLocation.country}`
                : hoveredLocation.country}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorldMap;
