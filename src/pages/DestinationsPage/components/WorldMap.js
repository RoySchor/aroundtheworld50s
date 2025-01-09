import React, { useState } from "react";
import "./WorldMap.css";
import worldMap from "../../../assets/flat-world-map.webp";
import blogs from "../../../data/blogs";

const WorldMap = () => {
  const [hoveredCountry, setHoveredCountry] = useState(null);

  const countryCoordinates = {
    "Trinidad and Tobago": {
      left: "32.9%",
      top: "56.3%",
    },
  };

  return (
    <div className="world-map-container">
      <img src={worldMap} alt="World Map" className="world-map" />

      {blogs.map((blog) => {
        const coordinates = countryCoordinates[blog.country];
        if (!coordinates) return null;

        return (
          <div
            key={blog.id}
            className="country-box-selector"
            style={{
              left: coordinates.left,
              top: coordinates.top,
              transform: "translate(-50%, -50%)",
            }}
            onMouseEnter={() => setHoveredCountry(blog)}
            onMouseLeave={() => setHoveredCountry(null)}
          />
        );
      })}

      {hoveredCountry && (
        <div className="hover-info-container">
          <div className="hover-info-image-container">
            <img
              src={require(
                `../../../assets/blog/${hoveredCountry.folder}/${hoveredCountry.background_image}`,
              )}
              alt={hoveredCountry.country}
              className="hover-info-image"
            />
          </div>

          <div className="hover-info-country-blog-container">
            <div className="hover-info-country-blog-title">
              {hoveredCountry.country}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorldMap;
