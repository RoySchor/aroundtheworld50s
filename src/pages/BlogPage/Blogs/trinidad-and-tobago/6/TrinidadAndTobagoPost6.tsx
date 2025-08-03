import React from "react";
import "../../../../../styles/layout.css";
import "../../BlogPost.css";
import TwoColumnLayout from "../../../../../components/TwoColumnLayout/TwoColumnLayout";
import ImageGrid from "../../../../../components/ImageGrid/ImageGrid";
import MapEmbed from "../../../../../components/MapEmbed/MapEmbed";
import InstagramEmbedSection from "../../../../../pages/HomePage/components/InstagramEmbedSection";
import { TRINIDAD_AND_TOBAGO_POST_6 } from "./TrinidadAndTobagoPost6.constants.ts";
import { ContentSection } from "./TrinidadAndTobagoPost6.types";
import { getImagePathFromBlogPost } from "../../BlogPost.utils.ts";

const TrinidadAndTobagoPost6 = () => {
  const Nylonpoolbuccooreef = (
    <MapEmbed
      title="Nylon Pool Buccoo Reef"
      url="https://www.google.com/maps/embed?pb=!1m46!1m12!1m3!1d15657.059913678198!2d-60.84242305277283!3d11.168005974087151!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m31!3e0!4m5!1s0x8c49b3e87f71c9af%3A0x1632d2b72b7ec267!2sStore%20Bay%20Beach%2C%20Crown%20Point%2C%20Trinidad%20and%20Tobago!3m2!1d11.1559032!2d-60.839817499999995!4m5!1s0x8c49b3962521cfbf%3A0x736df3b46cfd0921!2sPigeon%20Point%20Beach%2C%20Trinidad%20and%20Tobago!3m2!1d11.1729402!2d-60.8382219!4m5!1s0x8c49b3005e884753%3A0x3237529e00e7259b!2sNylon%20Pool%2C%20Pigeon%20Point%20Road%2C%20Bon%20Accord%2C%20Trinidad%20and%20Tobago!3m2!1d11.1647213!2d-60.840097799999995!4m5!1s0x8c49b3a169f6af53%3A0x16f361e956f4218b!2sBuccoo%20Reef%2C%20Trinidad%20and%20Tobago!3m2!1d11.1822328!2d-60.8310901!4m5!1s0x8c49b3b761df1489%3A0x52f6ef57d1c9b49f!2sNo%20Man%E2%80%99s%20Land%2C%20Bon%20Accord%2C%20Trinidad%20and%20Tobago!3m2!1d11.168677299999999!2d-60.8250007!5e0!3m2!1sen!2sus!4v1754233605541!5m2!1sen!2sus"
    />
  );

  let itinerary: { title: string; items: string[] };

  const maps = [Nylonpoolbuccooreef];

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
        itinerary = TRINIDAD_AND_TOBAGO_POST_6.itineraries[section.layout.mapIndex];
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
          blogPath="trinidad-and-tobago/6"
        />;
      case "two-column":
        return (
          <TwoColumnLayout
            leftPane={{
              type: section.layout.leftType,
              imageUrl:
                section.layout.leftType === "image"
                  ? getImagePathFromBlogPost(TRINIDAD_AND_TOBAGO_POST_6, section.leftImage || "")
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
                  ? getImagePathFromBlogPost(TRINIDAD_AND_TOBAGO_POST_6, section.rightImage || "")
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
          backgroundImage: `url(${getImagePathFromBlogPost(TRINIDAD_AND_TOBAGO_POST_6, TRINIDAD_AND_TOBAGO_POST_6.backgroundImage || "")})`,
        }}
      >
        <div className="fixed-background-text-container">
          <div className="fixed-background-title fixed-background-no-margin">
            {TRINIDAD_AND_TOBAGO_POST_6.header}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="page-content">
          <div className="post-title">{TRINIDAD_AND_TOBAGO_POST_6.title}</div>

          <div className="post-subtitle">{TRINIDAD_AND_TOBAGO_POST_6.subtitle}</div>

          <div
            className="post-description"
            dangerouslySetInnerHTML={{ __html: TRINIDAD_AND_TOBAGO_POST_6.description }}
          />

          {TRINIDAD_AND_TOBAGO_POST_6.tipsSection && (
            <div className="post-bolded-text post-tips-section-container">
              {TRINIDAD_AND_TOBAGO_POST_6.tipsLink ? (
                <a
                  href={TRINIDAD_AND_TOBAGO_POST_6.tipsLink}
                  className="post-tips-link"
                  dangerouslySetInnerHTML={{ __html: TRINIDAD_AND_TOBAGO_POST_6.tipsSection }}
                />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: TRINIDAD_AND_TOBAGO_POST_6.tipsSection }} />
              )}
            </div>
          )}

          {TRINIDAD_AND_TOBAGO_POST_6.content.map((item, index) => (
            <div key={item.key || index}>
              {renderContent(item)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrinidadAndTobagoPost6;
