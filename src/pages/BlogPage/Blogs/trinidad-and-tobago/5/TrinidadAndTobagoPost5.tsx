import React from "react";
import "../../../../../styles/layout.css";
import "../../BlogPost.css";
import TwoColumnLayout from "../../../../../components/TwoColumnLayout/TwoColumnLayout";
import ImageGrid from "../../../../../components/ImageGrid/ImageGrid";
import MapEmbed from "../../../../../components/MapEmbed/MapEmbed";
import InstagramEmbedSection from "../../../../../pages/HomePage/components/InstagramEmbedSection";
import { TRINIDAD_AND_TOBAGO_POST_5 } from "./TrinidadAndTobagoPost5.constants.ts";
import { ContentSection } from "./TrinidadAndTobagoPost5.types";
import { getImagePathFromBlogPost } from "../../BlogPost.utils.ts";

const TrinidadAndTobagoPost5 = () => {
  const TobagoBeaches = (
    <MapEmbed
      title="Tobago_Beaches"
      url="https://www.google.com/maps/embed?pb=!1m40!1m12!1m3!1d62602.293107024634!2d-60.69761350489427!3d11.287608406702049!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m25!3e0!4m5!1s0x8c4853e8fedee33d%3A0x1ef432cfd6352f48!2sCastara%20Bay%20Rd%2C%20Trinidad%20and%20Tobago!3m2!1d11.279954!2d-60.6950764!4m5!1s0x8c4853e87af0512b%3A0x9bb0b51268c22197!2sCastara%20Beach!3m2!1d11.279833!2d-60.695929899999996!4m5!1s0x8c485154b47f626b%3A0x26ea8ba399baf10a!2sEnglishmans%20Bay%2C%20Trinidad%20and%20Tobago!3m2!1d11.2918583!2d-60.6727874!4m5!1s0x8c4855caafa4f21b%3A0xf07a1bfe142e60ad!2sTobago%20Main%20Ridge%20Forest%20Reserve%2C%20Mason%20Hall%2C%20Trinidad%20and%20Tobago!3m2!1d11.2737713!2d-60.6168974!5e0!3m2!1sen!2sus!4v1754186428058!5m2!1sen!2sus"
    />
  );

  let itinerary: { title: string; items: string[] };

  const maps = [TobagoBeaches];

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
        itinerary = TRINIDAD_AND_TOBAGO_POST_5.itineraries[section.layout.mapIndex];
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
          blogPath="trinidad-and-tobago/5"
        />;
      case "two-column":
        return (
          <TwoColumnLayout
            leftPane={{
              type: section.layout.leftType,
              imageUrl:
                section.layout.leftType === "image"
                  ? getImagePathFromBlogPost(TRINIDAD_AND_TOBAGO_POST_5, section.leftImage || "")
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
                  ? getImagePathFromBlogPost(TRINIDAD_AND_TOBAGO_POST_5, section.rightImage || "")
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
          backgroundImage: `url(${getImagePathFromBlogPost(TRINIDAD_AND_TOBAGO_POST_5, TRINIDAD_AND_TOBAGO_POST_5.backgroundImage || "")})`,
        }}
      >
        <div className="fixed-background-text-container">
          <div className="fixed-background-title fixed-background-no-margin">
            {TRINIDAD_AND_TOBAGO_POST_5.header}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="page-content">
          <div className="post-title">{TRINIDAD_AND_TOBAGO_POST_5.title}</div>

          <div className="post-subtitle">{TRINIDAD_AND_TOBAGO_POST_5.subtitle}</div>

          <div
            className="post-description"
            dangerouslySetInnerHTML={{ __html: TRINIDAD_AND_TOBAGO_POST_5.description }}
          />

          {TRINIDAD_AND_TOBAGO_POST_5.tipsSection && (
            <div className="post-bolded-text post-tips-section-container">
              {TRINIDAD_AND_TOBAGO_POST_5.tipsLink ? (
                <a
                  href={TRINIDAD_AND_TOBAGO_POST_5.tipsLink}
                  className="post-tips-link"
                  dangerouslySetInnerHTML={{ __html: TRINIDAD_AND_TOBAGO_POST_5.tipsSection }}
                />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: TRINIDAD_AND_TOBAGO_POST_5.tipsSection }} />
              )}
            </div>
          )}

          {TRINIDAD_AND_TOBAGO_POST_5.content.map((item, index) => (
            <div key={item.key || index}>
              {renderContent(item)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrinidadAndTobagoPost5;
