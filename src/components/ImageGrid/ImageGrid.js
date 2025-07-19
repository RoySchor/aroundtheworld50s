import React from "react";
import PropTypes from "prop-types";
import "./ImageGrid.css";

const ImageGrid = ({ images, imageCaptions, blogPath }) => {
  return (
    <div className="image-grid">
      {images.map((image, index) => (
        <div key={index} className="image-grid-item">
          <img
            src={require(`../../assets/blog/${blogPath}/${image}`)}
            alt={imageCaptions?.[index] || `Gallery ${index + 1}`}
            className="image-grid-image"
          />
          {imageCaptions?.[index] && (
            <div className="image-grid-caption">{imageCaptions[index]}</div>
          )}
        </div>
      ))}
    </div>
  );
};

ImageGrid.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  imageCaptions: PropTypes.arrayOf(PropTypes.string),
  blogPath: PropTypes.string.isRequired,
};

export default ImageGrid;
