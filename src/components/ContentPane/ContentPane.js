import React from "react";
import PropTypes from "prop-types";
import MapEmbed from "../MapEmbed/MapEmbed";
import ImageGrid from "../ImageGrid/ImageGrid";
import "./ContentPane.css";

const ContentPane = ({
  title,
  subtitle,
  description,
  mapEmbed,
  imageGrid,
  customContent,
  className = "",
}) => {
  return (
    <div className={`content-pane ${className}`}>
      {title && <h2 className="content-pane-title">{title}</h2>}
      {subtitle && <h3 className="content-pane-subtitle">{subtitle}</h3>}
      {description && (
        <div className="content-pane-description">{description}</div>
      )}
      {mapEmbed && <MapEmbed title={mapEmbed.title} url={mapEmbed.url} />}
      {imageGrid && <ImageGrid images={imageGrid.images} />}
      {customContent && (
        <div className="content-pane-custom">{customContent}</div>
      )}
    </div>
  );
};

ContentPane.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.node,
  mapEmbed: PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }),
  imageGrid: PropTypes.shape({
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
  customContent: PropTypes.node,
  className: PropTypes.string,
};

export default ContentPane;
