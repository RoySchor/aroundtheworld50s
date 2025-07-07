import React from "react";
import { Link } from "react-router-dom";
import tips from "../../data/tips";
import Flag from "react-world-flags";
import { getFlagCode } from "../../pages/AdminPage/components/TipsEditor/countryFlags";
import "./TipsPage.css";

const TipsPage = () => {
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
              <Link key={tip.id} to={`/tips/${tip.path}`} className="tip-card">
                <div className="tip-card-header">
                  <div className="tip-card-flag">
                    <Flag
                      code={getFlagCode(tip.country_code)}
                      alt={tip.country}
                      height="24"
                    />
                  </div>
                  <div className="tip-card-title">
                    <h2>{tip.title}</h2>
                    <p className="tip-card-location">
                      {tip.state ? `${tip.state}, ${tip.country}` : tip.country}
                    </p>
                  </div>
                </div>
                <p className="tip-card-description">{tip.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipsPage;
