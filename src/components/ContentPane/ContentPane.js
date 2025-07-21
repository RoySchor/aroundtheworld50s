import React from "react";
import PropTypes from "prop-types";
import "../../pages/BlogPage/Blogs/BlogPost.css";
import "./ContentPane.css";

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
        return (
          <div className="content-pane-text">
            <div
              className="post-description"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        );
      case "image":
        return (
          <div className="content-pane-image">
            <div className="image-container">
              <img src={imageUrl} alt={imageAlt || "Content image"} />
            </div>
          </div>
        );
      case "list":
        return (
          <div className="content-pane-list">
            <div className="post-itinerary-section">
              <div className="post-itinerary-title">{listTitle}</div>
              <ul>
                {listItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      case "map":
        return <div className="content-pane-map">{mapComponent}</div>;
      case "custom":
        return <div className="content-pane-custom">{content}</div>;
      default:
        return null;
    }
  };

  return (
    <div className={`content-pane content-pane-${type}`}>{renderContent()}</div>
  );
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
