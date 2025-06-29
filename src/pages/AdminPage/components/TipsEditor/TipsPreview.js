import React from "react";
import PropTypes from "prop-types";

const TipsPreview = ({ tip, tipsData }) => {
  const formatListText = (text) => {
    if (!text) return "";

    return text
      .split("\n")
      .map((line) => {
        const trimmed = line.trim();
        if (
          trimmed.startsWith("•") ||
          trimmed.startsWith("-") ||
          trimmed.startsWith("*")
        ) {
          return `<li>${trimmed.substring(1).trim()}</li>`;
        } else if (/^\d+\./.test(trimmed)) {
          return `<li>${trimmed.replace(/^\d+\.\s*/, "")}</li>`;
        } else if (trimmed) {
          return `<p>${trimmed}</p>`;
        }
        return "";
      })
      .join("");
  };

  const sections = [
    {
      key: "essentialTips",
      title: "🎯 Essential Tips",
      content: tipsData.essentialTips,
    },
    {
      key: "budgetPlanning",
      title: "💰 Budget Planning",
      content: tipsData.budgetPlanning,
    },
    {
      key: "foodDining",
      title: "🍽️ Food & Dining",
      content: tipsData.foodDining,
    },
    {
      key: "transportation",
      title: "🚗 Transportation",
      content: tipsData.transportation,
    },
    {
      key: "accommodation",
      title: "🏨 Accommodation",
      content: tipsData.accommodation,
    },
    {
      key: "safetyHealth",
      title: "⚠️ Safety & Health",
      content: tipsData.safetyHealth,
    },
  ];

  return (
    <div className="tips-preview">
      <div className="tips-preview-header">
        <h2>Preview: {tip.title}</h2>
        <p className="tips-preview-location">
          {tip.state ? `${tip.country}, ${tip.state}` : tip.country}
        </p>
      </div>

      <div className="tips-preview-content">
        {sections.map((section) => (
          <div key={section.key} className="tips-preview-section">
            <h3>{section.title}</h3>
            {section.content ? (
              <div
                className="tips-preview-section-content"
                dangerouslySetInnerHTML={{
                  __html: formatListText(section.content),
                }}
              />
            ) : (
              <div className="tips-preview-placeholder">
                <p>
                  <em>No content added yet for this section.</em>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

TipsPreview.propTypes = {
  tip: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    state: PropTypes.string,
  }).isRequired,
  tipsData: PropTypes.shape({
    essentialTips: PropTypes.string,
    budgetPlanning: PropTypes.string,
    foodDining: PropTypes.string,
    transportation: PropTypes.string,
    accommodation: PropTypes.string,
    safetyHealth: PropTypes.string,
  }).isRequired,
};

export default TipsPreview;
