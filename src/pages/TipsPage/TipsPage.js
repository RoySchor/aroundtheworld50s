import React from "react";
import { useNavigate } from "react-router-dom";
import tips from "../../data/tips";
import "../../styles/layout.css";
import "./TipsPage.css";

const TipsPage = () => {
  const navigate = useNavigate();

  const handleTipClick = (tipPath) => {
    navigate(`/tips/${tipPath}`);
  };

  return (
    <div className="page-container tips">
      <div className="container">
        <div className="page-content">
          <h1 className="page-title">Travel Tips by Destination</h1>
          <p className="tips-page-subtitle">
            Discover insider tips and essential information for your next
            adventure
          </p>

          <div className="tips-grid">
            {tips.map((tip) => (
              <div
                key={tip.id}
                className="tip-card"
                onClick={() => handleTipClick(tip.path)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleTipClick(tip.path);
                  }
                }}
              >
                <div className="tip-card-flag">
                  {tip.country_code === "TT" && "🇹🇹"}
                  {tip.country_code === "US" && "🇺🇸"}
                  {/* Add more flag emojis as needed */}
                </div>
                <h3 className="tip-card-title">{tip.title}</h3>
                <p className="tip-card-description">{tip.description}</p>
                <div className="tip-card-location">
                  {tip.state ? `${tip.country}, ${tip.state}` : tip.country}
                </div>
              </div>
            ))}

            {tips.length === 0 && (
              <div className="tips-empty-state">
                <h3>No tips available yet</h3>
                <p>
                  Tips will automatically appear here when you create blog posts
                  with tips sections.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipsPage;
