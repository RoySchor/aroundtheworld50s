import React from "react";
import PropTypes from "prop-types";
import tips from "../../../../data/tips";
import Flag from "react-world-flags";
import { getFlagCode } from "./countryFlags";

const TipsSelector = ({ selectedTip, onTipSelect }) => {
  return (
    <div className="tips-selector">
      <h3>Select a Tips Page to Edit</h3>

      {tips.length === 0 ? (
        <div className="tips-selector-empty">
          <p>No tips pages available yet.</p>
          <p>Create a blog post with a tips section to generate tips pages.</p>
        </div>
      ) : (
        <div className="tips-selector-list">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className={`tips-selector-item ${
                selectedTip?.id === tip.id ? "selected" : ""
              }`}
              onClick={() => onTipSelect(tip)}
            >
              <div className="tips-selector-item-header">
                <div className="tips-selector-flag">
                  <Flag
                    code={getFlagCode(tip.country_code)}
                    alt={tip.country}
                    height="16"
                  />
                </div>
                <div className="tips-selector-info">
                  <h4>{tip.title}</h4>
                  <p className="tips-selector-location">
                    {tip.state ? `${tip.state}, ${tip.country}` : tip.country}
                  </p>
                </div>
              </div>
              <div className="tips-selector-description">{tip.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

TipsSelector.propTypes = {
  selectedTip: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    state: PropTypes.string,
  }),
  onTipSelect: PropTypes.func.isRequired,
};

export default TipsSelector;
