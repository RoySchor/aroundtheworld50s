import React from "react";
import PropTypes from "prop-types";
import "./ImageGrid.css";

const ImageGrid = ({ images, blogPath }) => {
  return (
    <div className="image-grid">
      {images.map((image, index) => (
        <div key={index} className="image-grid-item">
          <img
            src={require(`../../assets/blog/${blogPath}/${image}`)}
            alt={`Gallery ${index + 1}`}
            className="image-grid-image"
          />
        </div>
      ))}
    </div>
  );
};

ImageGrid.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  blogPath: PropTypes.string.isRequired,
};

export default ImageGrid;
