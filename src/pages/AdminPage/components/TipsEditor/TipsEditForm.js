import React from "react";
import PropTypes from "prop-types";

const TipsEditForm = ({ tipsData, onDataChange }) => {
  const sections = [
    {
      key: "essentialTips",
      title: "🎯 Essential Tips",
      placeholder:
        "Add essential travel tips here. You can include general advice, must-know information, and insider tips.",
    },
    {
      key: "budgetPlanning",
      title: "💰 Budget Planning",
      placeholder:
        "Add budget information, cost estimates, money-saving tips, and pricing guidelines.",
    },
    {
      key: "foodDining",
      title: "🍽️ Food & Dining",
      placeholder:
        "Add information about local cuisine, restaurant recommendations, food safety tips, and dining etiquette.",
    },
    {
      key: "transportation",
      title: "🚗 Transportation",
      placeholder:
        "Add details about getting around, public transport, taxi services, car rentals, and travel tips.",
    },
    {
      key: "accommodation",
      title: "🏨 Accommodation",
      placeholder:
        "Add hotel recommendations, booking tips, area suggestions, and accommodation advice.",
    },
    {
      key: "safetyHealth",
      title: "⚠️ Safety & Health",
      placeholder:
        "Add safety guidelines, health tips, emergency information, and travel precautions.",
    },
  ];

  const handleTextChange = (sectionKey, value) => {
    onDataChange(sectionKey, value);
  };

  const formatListText = (text) => {
    // Convert bullet points and numbered lists to HTML
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

  return (
    <div className="tips-edit-form">
      <div className="tips-edit-instructions">
        <h4>💡 Editing Tips:</h4>
        <ul>
          <li>
            Use bullet points (•, -, *) or numbered lists (1., 2., 3.) for
            organized content
          </li>
          <li>Separate different topics with blank lines</li>
          <li>Content will be automatically formatted when saved</li>
        </ul>
      </div>

      {sections.map((section) => (
        <div key={section.key} className="tips-edit-section">
          <label className="tips-edit-label">{section.title}</label>
          <textarea
            className="tips-edit-textarea"
            value={tipsData[section.key] || ""}
            onChange={(e) => handleTextChange(section.key, e.target.value)}
            placeholder={section.placeholder}
            rows={8}
          />

          {/* Preview of formatted content */}
          {tipsData[section.key] && (
            <div className="tips-edit-preview">
              <strong>Preview:</strong>
              <div
                className="tips-formatted-content"
                dangerouslySetInnerHTML={{
                  __html: formatListText(tipsData[section.key]),
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

TipsEditForm.propTypes = {
  tipsData: PropTypes.shape({
    essentialTips: PropTypes.string,
    budgetPlanning: PropTypes.string,
    foodDining: PropTypes.string,
    transportation: PropTypes.string,
    accommodation: PropTypes.string,
    safetyHealth: PropTypes.string,
  }).isRequired,
  onDataChange: PropTypes.func.isRequired,
};

export default TipsEditForm;
