import React from "react";
import PropTypes from "prop-types";
import "../../pages/BlogPage/Blogs/BlogPost.css";

const ContentPane = ({ type, content, imageAlt, imageUrl, mapComponent }) => {
  const renderContent = () => {
    switch (type) {
      case "text":
        return <div className="post-description">{content}</div>;
      case "image":
        return (
          <div className="image-container">
            <img src={imageUrl} alt={imageAlt || "Content image"} />
          </div>
        );
      case "map":
        return mapComponent;
      case "custom":
        return content;
      default:
        return null;
    }
  };

  return renderContent();
};

ContentPane.propTypes = {
  type: PropTypes.oneOf(["text", "image", "map", "custom"]).isRequired,
  content: PropTypes.node,
  imageAlt: PropTypes.string,
  imageUrl: PropTypes.string,
  mapComponent: PropTypes.node,
};

export default ContentPane;
