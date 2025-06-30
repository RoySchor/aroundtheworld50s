import React from "react";
import PropTypes from "prop-types";

const TipsPreview = ({ tip, tipsData }) => {
  const formatMarkdownText = (text) => {
    if (!text) return "";

    // Split text into lines
    const lines = text.split("\n");
    const result = [];
    let currentList = [];
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Check if line is a bullet point (starts and ends with •)
      if (line.startsWith("•") && line.endsWith("•")) {
        const listItem = line.slice(1, -1).trim();

        // Apply text formatting (bold and italic) to list item
        const formattedItem = applyTextFormatting(listItem);
        currentList.push(`<li>${formattedItem}</li>`);
        inList = true;
      } else {
        if (inList && currentList.length > 0) {
          result.push(`<ul>${currentList.join("")}</ul>`);
          currentList = [];
          inList = false;
        }

        if (line === "") {
          result.push("<br>");
        } else if (line.length > 0) {
          const formattedLine = applyTextFormatting(line);
          result.push(`<p>${formattedLine}</p>`);
        }
      }
    }

    if (inList && currentList.length > 0) {
      result.push(`<ul>${currentList.join("")}</ul>`);
    }

    return result.join("");
  };

  const applyTextFormatting = (text) => {
    if (!text) return "";

    // Apply bold formatting (**text**)
    let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Apply italic formatting (*text*) - but not if it's part of **text**
    formatted = formatted.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, "<em>$1</em>");

    return formatted;
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
                  __html: formatMarkdownText(section.content),
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
