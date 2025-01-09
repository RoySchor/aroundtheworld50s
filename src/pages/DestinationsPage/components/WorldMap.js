import React, { useState } from "react";
import "./WorldMap.css";
import worldMap from "../../../assets/flat-world-map.webp";
import blogs from "../../../data/blogs";
import { countryCoordinates } from "./WorldMap.constants";
import { serializeCountry } from "../DestinationPage.utils";

const WorldMap = () => {
  const [hoveredCountry, setHoveredCountry] = useState(null);

  const uniqueCountryBlogs = Object.values(
    blogs.reduce((acc, blog) => {
      if (!acc[blog.country]) {
        acc[blog.country] = blog;
      }
      return acc;
    }, {}),
  );

  return (
    <div className="world-map-container">
      <img src={worldMap} alt="World Map" className="world-map" />

      {uniqueCountryBlogs.map((blog) => {
        const coordinates = countryCoordinates[blog.country];
        if (!coordinates) return null;

        return (
          <a href={`/blog/${serializeCountry(blog.country)}`} key={blog.id}>
            <div
              className="country-box-selector"
              style={{
                left: coordinates.left,
                top: coordinates.top,
                transform: "translate(-50%, -50%)",
              }}
              onMouseEnter={() => setHoveredCountry(blog)}
              onMouseLeave={() => setHoveredCountry(null)}
            />
          </a>
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
