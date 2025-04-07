import React from "react";
import PropTypes from "prop-types";
import ContentPane from "../ContentPane/ContentPane";
import "./TwoColumnLayout.css";

const TwoColumnLayout = ({ leftContent, rightContent }) => {
  return (
    <div className="two-column-layout">
      <div className="column left-column">{leftContent}</div>
      <div className="column right-column">{rightContent}</div>
    </div>
  );
};

TwoColumnLayout.propTypes = {
  leftContent: PropTypes.node.isRequired,
  rightContent: PropTypes.node.isRequired,
};

export default TwoColumnLayout;
