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
      content: tipsData.essentialTips?.content,
      enabled: tipsData.essentialTips?.enabled,
    },
    {
      key: "budgetPlanning",
      title: "💰 Budget Planning",
      content: tipsData.budgetPlanning?.content,
      enabled: tipsData.budgetPlanning?.enabled,
    },
    {
      key: "foodDining",
      title: "🍽️ Food & Dining",
      content: tipsData.foodDining?.content,
      enabled: tipsData.foodDining?.enabled,
    },
    {
      key: "transportation",
      title: "🚗 Transportation",
      content: tipsData.transportation?.content,
      enabled: tipsData.transportation?.enabled,
    },
    {
      key: "accommodation",
      title: "🏨 Accommodation",
      content: tipsData.accommodation?.content,
      enabled: tipsData.accommodation?.enabled,
    },
    {
      key: "safetyHealth",
      title: "⚠️ Safety & Health",
      content: tipsData.safetyHealth?.content,
      enabled: tipsData.safetyHealth?.enabled,
    },
  ].filter((section) => section.enabled); // Only show enabled sections

  return (
    <div className="tips-preview">
      <div className="tips-preview-header">
        <h2>Preview: {tip.title}</h2>
        <p className="tips-preview-location">
          {tip.state ? `${tip.country}, ${tip.state}` : tip.country}
        </p>
      </div>

      <div className="tips-preview-content">
        {sections.length > 0 ? (
          sections.map((section) => (
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
          ))
        ) : (
          <div className="tips-preview-no-sections">
            <div className="tips-preview-placeholder">
              <h3>📝 No Sections Enabled</h3>
              <p>
                <em>
                  You haven't enabled any sections yet. Go back to the Edit Tips
                  tab and check the boxes next to the sections you want to
                  include in your tips page.
                </em>
              </p>
            </div>
          </div>
        )}
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
    essentialTips: PropTypes.shape({
      content: PropTypes.string,
      enabled: PropTypes.bool,
    }),
    budgetPlanning: PropTypes.shape({
      content: PropTypes.string,
      enabled: PropTypes.bool,
    }),
    foodDining: PropTypes.shape({
      content: PropTypes.string,
      enabled: PropTypes.bool,
    }),
    transportation: PropTypes.shape({
      content: PropTypes.string,
      enabled: PropTypes.bool,
    }),
    accommodation: PropTypes.shape({
      content: PropTypes.string,
      enabled: PropTypes.bool,
    }),
    safetyHealth: PropTypes.shape({
      content: PropTypes.string,
      enabled: PropTypes.bool,
    }),
  }).isRequired,
};

export default TipsPreview;
