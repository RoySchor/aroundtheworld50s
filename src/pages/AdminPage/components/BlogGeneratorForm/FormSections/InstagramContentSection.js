import React from "react";
import PropTypes from "prop-types";

const InstagramContentSection = () => {
  return (
    <div className="blog-form-instagram-section">
      <div className="blog-form-section-info">
        <small className="blog-form-help-text">
          💡 <strong>Info:</strong> This will add your AroundTheWorld50s
          Instagram feed to the blog post.
        </small>
      </div>
    </div>
  );
};

InstagramContentSection.propTypes = {
  section: PropTypes.shape({
    key: PropTypes.string.isRequired,
    layout: PropTypes.shape({
      type: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  sectionIndex: PropTypes.number.isRequired,
  onContentChange: PropTypes.func.isRequired,
  generateKey: PropTypes.func.isRequired,
};

export default InstagramContentSection;
