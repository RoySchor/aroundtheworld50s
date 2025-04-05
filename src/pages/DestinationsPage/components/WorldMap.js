import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./WorldMap.css";
import worldMap from "../../../assets/flat-world-map.webp";
import blogs from "../../../data/blogs";
import { locationCoordinates } from "./WorldMap.constants";
import { serializeLocation } from "../DestinationPage.utils";
import Flag from "react-world-flags";

const WorldMap = () => {
  const [hoveredLocation, setHoveredLocation] = useState(null);

  const uniqueCountryBlogs = Object.values(
    blogs.reduce((accumulator, blog) => {
      const locationKey = `${blog.country}${blog.state ? `-${blog.state}` : ""}`;

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
        const locationKey = `${blog.country}${blog.state ? `-${blog.state}` : ""}`;
        const coordinates = locationCoordinates[locationKey];
        if (!coordinates) return null;

        // Create URL using the serialized country name
        const serializedCountry = serializeLocation(blog.country);
        const to = `/blog/${serializedCountry}`;

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
