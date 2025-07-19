import React from "react";
import PropTypes from "prop-types";
import "./ImageGrid.css";

const ImageGrid = ({ images, captions, blogPath }) => {
  return (
    <div className="image-grid">
      {images.map((image, index) => (
        <div key={index} className="image-grid-item">
          <img
            src={require(`../../assets/blog/${blogPath}/${image}`)}
            alt={captions?.[index] || `Gallery ${index + 1}`}
            className="image-grid-image"
          />
          {captions?.[index] && (
            <div className="image-grid-caption">{captions[index]}</div>
          )}
        </div>
      ))}
    </div>
  );
};

ImageGrid.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  captions: PropTypes.arrayOf(PropTypes.string),
  blogPath: PropTypes.string.isRequired,
};

export default ImageGrid;
