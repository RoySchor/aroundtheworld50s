import React from "react";
import PropTypes from "prop-types";
import "./TwoColumnLayout.css";
import ContentPane from "../ContentPane/ContentPane";

const TwoColumnLayout = ({ leftPane, rightPane }) => {
  return (
    <div className="two-column-layout">
      <div className="column left-column">
        <ContentPane {...leftPane} />
      </div>
      <div className="column right-column">
        <ContentPane {...rightPane} />
      </div>
    </div>
  );
};

TwoColumnLayout.propTypes = {
  leftPane: PropTypes.shape(ContentPane.propTypes).isRequired,
  rightPane: PropTypes.shape(ContentPane.propTypes).isRequired,
};

export default TwoColumnLayout;
