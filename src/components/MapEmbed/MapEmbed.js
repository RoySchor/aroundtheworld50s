import React from "react";
import PropTypes from "prop-types";
import "./MapEmbed.css";

const MapEmbed = ({ title, url }) => {
  return (
    <div className="map-embed">
      <h3 className="map-title">{title}</h3>
      <div className="map-container">
        <iframe
          title={`${title} - Interactive Map`}
          src={url}
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

MapEmbed.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default MapEmbed;
