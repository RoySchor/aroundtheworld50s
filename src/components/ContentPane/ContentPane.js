import React from "react";
import PropTypes from "prop-types";
import "../../pages/BlogPage/Blogs/BlogPost.css";

const ContentPane = ({
  type,
  content,
  imageAlt,
  imageUrl,
  mapComponent,
  listTitle,
  listItems,
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
      case "list":
        return (
          <div className="post-itinerary-section">
            <div className="post-itinerary-title">{listTitle}</div>
            <ul>
              {listItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
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
  type: PropTypes.oneOf(["text", "list", "image", "map", "custom"]).isRequired,
  content: PropTypes.node,
  imageAlt: PropTypes.string,
  imageUrl: PropTypes.string,
  mapComponent: PropTypes.node,
  listTitle: PropTypes.string,
  listItems: PropTypes.arrayOf(PropTypes.node),
};

export default ContentPane;
