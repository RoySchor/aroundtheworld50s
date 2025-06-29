import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import tips from "../../data/tips";
import { loadTipsContent } from "../../utils/tipsFileManager";
import "../../styles/layout.css";
import "./TipDetailPage.css";

const TipDetailPage = () => {
  const { location } = useParams();
  const [tipsContent, setTipsContent] = useState(null);
  const [loading, setLoading] = useState(true);

  const tip = tips.find((t) => t.path === location);

  useEffect(() => {
    const loadContent = async () => {
      if (tip) {
        try {
          const content = await loadTipsContent(tip.path);
          setTipsContent(content);
        } catch (error) {
          console.log("Tips content not available yet:", error);
          setTipsContent(null);
        }
      }
      setLoading(false);
    };

    loadContent();
  }, [tip]);

  const renderContentSection = (title, contentKey, placeholder) => {
    const content = tipsContent?.content?.[contentKey];

    return (
      <div className="tip-section">
        <h2>{title}</h2>
        {content ? (
          <div
            className="tip-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <div className="tip-placeholder">
            <p>{placeholder}</p>
            {!loading && (
              <p>
                This page will be automatically populated with practical travel
                advice, local insights, and insider tips.
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  if (!tip) {
    return (
      <div className="page-container tips-detail">
        <div className="container">
          <div className="page-content">
            <div className="tip-not-found">
              <h1>Tips Not Found</h1>
              <p>The tips page for "{location}" doesn't exist yet.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container tips-detail">
      <div className="container">
        <div className="page-content">
          <div className="tip-detail-header">
            <div className="tip-detail-title-section">
              <h1 className="tip-detail-title">{tip.title}</h1>
              <p className="tip-detail-location">
                {tip.state ? `${tip.country}, ${tip.state}` : tip.country}
              </p>
            </div>
          </div>

          <div className="tip-detail-content">
            {renderContentSection(
              "🎯 Essential Tips",
              "essentialTips",
              `Tips for ${tip.state ? `${tip.state}, ${tip.country}` : tip.country} will be added here.`,
            )}

            {renderContentSection(
              "💰 Budget Planning",
              "budgetPlanning",
              "Budget information and cost-saving tips coming soon...",
            )}

            {renderContentSection(
              "🍽️ Food & Dining",
              "foodDining",
              "Local cuisine recommendations and dining tips coming soon...",
            )}

            {renderContentSection(
              "🚗 Transportation",
              "transportation",
              "Getting around and transportation tips coming soon...",
            )}

            {renderContentSection(
              "🏨 Accommodation",
              "accommodation",
              "Where to stay and booking tips coming soon...",
            )}

            {renderContentSection(
              "⚠️ Safety & Health",
              "safetyHealth",
              "Safety guidelines and health tips coming soon...",
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipDetailPage;
