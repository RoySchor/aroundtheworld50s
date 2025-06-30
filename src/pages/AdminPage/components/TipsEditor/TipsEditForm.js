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

  return (
    <div className="tips-edit-form">
      <div className="tips-edit-instructions">
        <h4>📝 Formatting Guide:</h4>
        <div className="tips-formatting-guide">
          <div className="tips-formatting-section">
            <h5>✨ Text Formatting:</h5>
            <ul>
              <li>
                <code>**bold text**</code> → <strong>bold text</strong>
              </li>
              <li>
                <code>*italic text*</code> → <em>italic text</em>
              </li>
            </ul>
          </div>

          <div className="tips-formatting-section">
            <h5>📋 Lists:</h5>
            <ul>
              <li>
                <code>• list item •</code> → Bullet point
              </li>
              <li>Multiple bullet points create a list automatically</li>
              <li>Example:</li>
            </ul>
            <div className="tips-formatting-example">
              <div className="tips-example-input">
                <strong>You type:</strong>
                <br />
                <code>
                  Here are some budget tips:
                  <br />
                  • Save money on food •<br />
                  • Use public transport •<br />• Book early for discounts •
                </code>
              </div>
              <div className="tips-example-output">
                <strong>You get:</strong>
                <br />
                Here are some budget tips:
                <br />
                <ul>
                  <li>Save money on food</li>
                  <li>Use public transport</li>
                  <li>Book early for discounts</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="tips-formatting-section">
            <h5>💡 Pro Tips:</h5>
            <ul>
              <li>Empty lines create line breaks</li>
              <li>
                You can use **bold** and *italic* inside • bullet points •
              </li>
            </ul>
          </div>
        </div>
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
