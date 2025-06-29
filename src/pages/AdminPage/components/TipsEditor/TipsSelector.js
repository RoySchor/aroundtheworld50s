import React from "react";
import PropTypes from "prop-types";
import tips from "../../../../data/tips";

const TipsSelector = ({ selectedTip, onTipSelect }) => {
  return (
    <div className="tips-selector">
      <h3>Select Tips Page to Edit</h3>

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
                  {tip.country_code === "TT" && "🇹🇹"}
                  {tip.country_code === "US" && "🇺🇸"}
                  {/* Add more flag emojis as needed */}
                </div>
                <div className="tips-selector-info">
                  <h4>{tip.title}</h4>
                  <p className="tips-selector-location">
                    {tip.state ? `${tip.country}, ${tip.state}` : tip.country}
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
