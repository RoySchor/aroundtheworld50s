import React from "react";
import PropTypes from "prop-types";
import "./ContentPane.css";
import "../../pages/BlogPage/Blogs/BlogPost.css";

const ContentPane = ({
  type,
  title,
  description,
  content,
  imageAlt,
  imageUrl,
  mapComponent,
  className,
}) => {
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

  return (
    <div className={`content-pane ${className || ""}`}>
      {title && <h3 className="content-pane-title">{title}</h3>}
      {description && <p className="content-pane-description">{description}</p>}
      {renderContent()}
    </div>
  );
};

ContentPane.propTypes = {
  type: PropTypes.oneOf(["text", "image", "map", "custom"]).isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  content: PropTypes.node,
  imageAlt: PropTypes.string,
  imageUrl: PropTypes.string,
  mapComponent: PropTypes.node,
  className: PropTypes.string,
};

export default ContentPane;
