import React from "react";
import "../../../../../styles/layout.css";
import "../../BlogPost.css";
import TwoColumnLayout from "../../../../../components/TwoColumnLayout/TwoColumnLayout";
import ImageGrid from "../../../../../components/ImageGrid/ImageGrid";
import MapEmbed from "../../../../../components/MapEmbed/MapEmbed";
import InstagramEmbedSection from "../../../../../pages/HomePage/components/InstagramEmbedSection";
import { UNITED_STATES_NEW_YORK_POST_3 } from "./UnitedStatesNewYorkPost3.constants.ts";
import { ContentSection } from "./UnitedStatesNewYorkPost3.types";
import { getImagePathFromBlogPost } from "../../BlogPost.utils.ts";

const UnitedStatesNewYorkPost3 = () => {
  let itinerary: { title: string; items: string[] };

  const maps = [];

  const renderContent = (section: ContentSection) => {
    switch (section.layout.type) {
      case "text":
        return (
          <div
            key={section.key}
            className="post-description"
            dangerouslySetInnerHTML={{ __html: section.content || "" }}
          />
        );
      case "itinerary-with-map":
        itinerary = UNITED_STATES_NEW_YORK_POST_3.itineraries[section.layout.mapIndex];
        return (
          <TwoColumnLayout
            leftPane={{
              type: "list",
              listTitle: itinerary.title,
              listItems: itinerary.items,
            }}
            rightPane={{
              type: "map",
              mapComponent: maps[section.layout.mapIndex],
            }}
          />
        );
      case "image-grid":
        return <ImageGrid
          images={section.images || []}
          blogPath="united-states-new-york/3"
        />;
      case "two-column":
        return (
          <TwoColumnLayout
            leftPane={{
              type: section.layout.leftType,
              imageUrl:
                section.layout.leftType === "image"
                  ? getImagePathFromBlogPost(UNITED_STATES_NEW_YORK_POST_3, section.leftImage || "")
                  : undefined,
              imageAlt: section.layout.imageAlt,
              content:
                section.layout.leftType === "text"
                  ? section.content
                  : undefined,
            }}
            rightPane={{
              type: section.layout.rightType,
              imageUrl:
                section.layout.rightType === "image"
                  ? getImagePathFromBlogPost(UNITED_STATES_NEW_YORK_POST_3, section.rightImage || "")
                  : undefined,
              imageAlt: section.layout.imageAlt,
              content:
                section.layout.rightType === "text"
                  ? section.content
                  : undefined,
            }}
          />
        );
      case "instagram":
        return <InstagramEmbedSection />;
      default:
        return null;
    }
  };

  return (
    <div className="page-container">
      <div
        className="fixed-background-container"
        style={{
          backgroundImage: `url(${getImagePathFromBlogPost(UNITED_STATES_NEW_YORK_POST_3, UNITED_STATES_NEW_YORK_POST_3.backgroundImage || "")})`,
        }}
      >
        <div className="fixed-background-text-container">
          <div className="fixed-background-title fixed-background-no-margin">
            {UNITED_STATES_NEW_YORK_POST_3.header}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="page-content">
          <div className="post-title">{UNITED_STATES_NEW_YORK_POST_3.title}</div>

          <div className="post-subtitle">{UNITED_STATES_NEW_YORK_POST_3.subtitle}</div>

          <div
            className="post-description"
            dangerouslySetInnerHTML={{ __html: UNITED_STATES_NEW_YORK_POST_3.description }}
          />

          {UNITED_STATES_NEW_YORK_POST_3.tipsSection && (
            <div className="post-bolded-text post-tips-section-container">
              {UNITED_STATES_NEW_YORK_POST_3.tipsLink ? (
                <a
                  href={UNITED_STATES_NEW_YORK_POST_3.tipsLink}
                  className="post-tips-link"
                  dangerouslySetInnerHTML={{ __html: UNITED_STATES_NEW_YORK_POST_3.tipsSection }}
                />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: UNITED_STATES_NEW_YORK_POST_3.tipsSection }} />
              )}
            </div>
          )}

          {UNITED_STATES_NEW_YORK_POST_3.content.map((item, index) => (
            <div key={item.key || index}>
              {renderContent(item)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UnitedStatesNewYorkPost3;
