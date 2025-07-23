import React from "react";
import "../../../../../styles/layout.css";
import "../../BlogPost.css";
import TwoColumnLayout from "../../../../../components/TwoColumnLayout/TwoColumnLayout";
import ImageGrid from "../../../../../components/ImageGrid/ImageGrid";
import MapEmbed from "../../../../../components/MapEmbed/MapEmbed";
import InstagramEmbedSection from "../../../../../pages/HomePage/components/InstagramEmbedSection";
import { TRINIDAD_AND_TOBAGO_POST_2 } from "./TrinidadAndTobagoPost2.constants.ts";
import { ContentSection } from "./TrinidadAndTobagoPost2.types";
import { getImagePathFromBlogPost } from "../../BlogPost.utils.ts";

const TrinidadAndTobagoPost2 = () => {
  const Northcoasttrinidad = (
    <MapEmbed
      title="North_Coast_Trinidad"
      url="https://www.google.com/maps/embed?pb=!1m58!1m12!1m3!1d125442.47263224369!2d-61.47073398029191!3d10.728523662202457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m43!3e2!4m5!1s0x8c3607d0be7ebb55%3A0x2dd4764afb66c4d6!2sThe%20BRIX%2C%20Autograph%20Collection%2C%20Coblentz%20Avenue%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6730318!2d-61.5088929!4m5!1s0x8c3607c454a09b73%3A0xbb469d340cd8d169!2sLady%20Young%20Rd!3m2!1d10.668149699999999!2d-61.4871851!4m5!1s0x8c3607696d6c2df5%3A0xddfd6bc9e438a485!2sSan%20Juan%2C%20Trinidad%20and%20Tobago!3m2!1d10.6497912!2d-61.4518707!4m5!1s0x8c360340cf196431%3A0x95297fed81250acf!2sLas%20Cuevas%20Beach%2C%20Trinidad%20and%20Tobago!3m2!1d10.7783555!2d-61.400871499999994!4m5!1s0x8c49e3465c4894b9%3A0x9e95f0c0b1c24fae!2sParia%20Bay%2C%20Blanchisseuse%2C%20Trinidad%20and%20Tobago!3m2!1d10.7940614!2d-61.2543271!4m5!1s0x8c36048a75922cd5%3A0x6adf3f042a6ba01b!2sMaracas%20Beach%2C%20Maracas%20Bay%20Village%2C%20Trinidad%20and%20Tobago!3m2!1d10.7587469!2d-61.439534599999995!4m5!1s0x8c3607d0be7ebb55%3A0x2dd4764afb66c4d6!2sThe%20BRIX%2C%20Autograph%20Collection%2C%20Coblentz%20Avenue%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6730318!2d-61.5088929!5e0!3m2!1sen!2sus!4v1752339544373!5m2!1sen!2sus"
    />
  );

  let itinerary: { title: string; items: string[] };

  const maps = [Northcoasttrinidad];

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
        itinerary = TRINIDAD_AND_TOBAGO_POST_2.itineraries[section.layout.mapIndex];
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
          blogPath="trinidad-and-tobago/2"
        />;
      case "two-column":
        return (
          <TwoColumnLayout
            leftPane={{
              type: section.layout.leftType,
              imageUrl:
                section.layout.leftType === "image"
                  ? getImagePathFromBlogPost(TRINIDAD_AND_TOBAGO_POST_2, section.leftImage || "")
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
                  ? getImagePathFromBlogPost(TRINIDAD_AND_TOBAGO_POST_2, section.rightImage || "")
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
          backgroundImage: `url(${getImagePathFromBlogPost(TRINIDAD_AND_TOBAGO_POST_2, TRINIDAD_AND_TOBAGO_POST_2.backgroundImage || "")})`,
        }}
      >
        <div className="fixed-background-text-container">
          <div className="fixed-background-title fixed-background-no-margin">
            {TRINIDAD_AND_TOBAGO_POST_2.header}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="page-content">
          <div className="post-title">{TRINIDAD_AND_TOBAGO_POST_2.title}</div>

          <div className="post-subtitle">{TRINIDAD_AND_TOBAGO_POST_2.subtitle}</div>

          <div
            className="post-description"
            dangerouslySetInnerHTML={{ __html: TRINIDAD_AND_TOBAGO_POST_2.description }}
          />

          {TRINIDAD_AND_TOBAGO_POST_2.tipsSection && (
            <div className="post-bolded-text post-tips-section-container">
              {TRINIDAD_AND_TOBAGO_POST_2.tipsLink ? (
                <a
                  href={TRINIDAD_AND_TOBAGO_POST_2.tipsLink}
                  className="post-tips-link"
                  dangerouslySetInnerHTML={{ __html: TRINIDAD_AND_TOBAGO_POST_2.tipsSection }}
                />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: TRINIDAD_AND_TOBAGO_POST_2.tipsSection }} />
              )}
            </div>
          )}

          {TRINIDAD_AND_TOBAGO_POST_2.content.map((item, index) => (
            <div key={item.key || index}>
              {renderContent(item)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrinidadAndTobagoPost2;
