import React from "react";
import "../../../../../styles/layout.css";
import "../../BlogPost.css";
import TwoColumnLayout from "../../../../../components/TwoColumnLayout/TwoColumnLayout";
import ImageGrid from "../../../../../components/ImageGrid/ImageGrid";
import MapEmbed from "../../../../../components/MapEmbed/MapEmbed";
import InstagramEmbedSection from "../../../../../pages/HomePage/components/InstagramEmbedSection";
import { TRINIDAD_AND_TOBAGO_POST_3 } from "./TrinidadAndTobagoPost3.constants.ts";
import { ContentSection } from "./TrinidadAndTobagoPost3.types";
import { getImagePathFromBlogPost } from "../../BlogPost.utils.ts";

const TrinidadAndTobagoPost3 = () => {
  const WestCoastTrindad = (
    <MapEmbed
      title="West Coast Trindad"
      url="https://www.google.com/maps/embed?pb=!1m40!1m12!1m3!1d250998.64716139913!2d-61.44180391187146!3d10.590596775473855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m25!3e0!4m5!1s0x8c3607d0be7ebb55%3A0x2dd4764afb66c4d6!2sThe%20BRIX%2C%20Autograph%20Collection%2C%20Coblentz%20Avenue%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6730318!2d-61.5088929!4m5!1s0x8c49ff75c184d3bf%3A0xe3f0aa1c0cd2b39a!2sArima%2C%20Trinidad%20and%20Tobago!3m2!1d10.631941399999999!2d-61.284540899999996!4m5!1s0x8c49f3bc90e33e57%3A0x78dbce4df526b3d1!2sSangre%20Grande%20Regional%20Corporation%2C%20Trinidad%20and%20Tobago!3m2!1d10.6446884!2d-61.0937206!4m5!1s0x8c4a1959d9072d83%3A0x90b90eb387e28762!2sManzanilla%20Beach%2C%20Manzanilla%20Mayaro%20Road%2C%20Lower%20Manzanilla%2C%20Trinidad%20and%20Tobago!3m2!1d10.508058199999999!2d-61.0435229!5e0!3m2!1sen!2sus!4v1753758304605!5m2!1sen!2sus"
    />
  );

  let itinerary: { title: string; items: string[] };

  const maps = [WestCoastTrindad];

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
        itinerary = TRINIDAD_AND_TOBAGO_POST_3.itineraries[section.layout.mapIndex];
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
          blogPath="trinidad-and-tobago/3"
        />;
      case "two-column":
        return (
          <TwoColumnLayout
            leftPane={{
              type: section.layout.leftType,
              imageUrl:
                section.layout.leftType === "image"
                  ? getImagePathFromBlogPost(TRINIDAD_AND_TOBAGO_POST_3, section.leftImage || "")
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
                  ? getImagePathFromBlogPost(TRINIDAD_AND_TOBAGO_POST_3, section.rightImage || "")
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
          backgroundImage: `url(${getImagePathFromBlogPost(TRINIDAD_AND_TOBAGO_POST_3, TRINIDAD_AND_TOBAGO_POST_3.backgroundImage || "")})`,
        }}
      >
        <div className="fixed-background-text-container">
          <div className="fixed-background-title fixed-background-no-margin">
            {TRINIDAD_AND_TOBAGO_POST_3.header}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="page-content">
          <div className="post-title">{TRINIDAD_AND_TOBAGO_POST_3.title}</div>

          <div className="post-subtitle">{TRINIDAD_AND_TOBAGO_POST_3.subtitle}</div>

          <div
            className="post-description"
            dangerouslySetInnerHTML={{ __html: TRINIDAD_AND_TOBAGO_POST_3.description }}
          />

          {TRINIDAD_AND_TOBAGO_POST_3.tipsSection && (
            <div className="post-bolded-text post-tips-section-container">
              {TRINIDAD_AND_TOBAGO_POST_3.tipsLink ? (
                <a
                  href={TRINIDAD_AND_TOBAGO_POST_3.tipsLink}
                  className="post-tips-link"
                  dangerouslySetInnerHTML={{ __html: TRINIDAD_AND_TOBAGO_POST_3.tipsSection }}
                />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: TRINIDAD_AND_TOBAGO_POST_3.tipsSection }} />
              )}
            </div>
          )}

          {TRINIDAD_AND_TOBAGO_POST_3.content.map((item, index) => (
            <div key={item.key || index}>
              {renderContent(item)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrinidadAndTobagoPost3;
