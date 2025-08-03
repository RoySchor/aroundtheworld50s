import React from "react";
import "../../../../../styles/layout.css";
import "../../BlogPost.css";
import TwoColumnLayout from "../../../../../components/TwoColumnLayout/TwoColumnLayout";
import ImageGrid from "../../../../../components/ImageGrid/ImageGrid";
import MapEmbed from "../../../../../components/MapEmbed/MapEmbed";
import InstagramEmbedSection from "../../../../../pages/HomePage/components/InstagramEmbedSection";
import { TRINIDAD_AND_TOBAGO_POST_4 } from "./TrinidadAndTobagoPost4.constants.ts";
import { ContentSection } from "./TrinidadAndTobagoPost4.types";
import { getImagePathFromBlogPost } from "../../BlogPost.utils.ts";

const TrinidadAndTobagoPost4 = () => {
  const SouthCoastTrindad = (
    <MapEmbed
      title="South_Coast_Trindad"
      url="https://www.google.com/maps/embed?pb=!1m64!1m12!1m3!1d251125.70070911525!2d-61.68178347551487!3d10.434341829069302!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m49!3e0!4m5!1s0x8c3607d0be7ebb55%3A0x2dd4764afb66c4d6!2sThe%20BRIX%2C%20Autograph%20Collection%2C%20Coblentz%20Avenue%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6730318!2d-61.5088929!4m5!1s0x8c35f97bc8e11f6b%3A0xc2c1d38701422f0c!2sChaguanas%2C%20Trinidad%20and%20Tobago!3m2!1d10.5168387!2d-61.4114482!4m5!1s0x8c35f0a801687fd5%3A0xdd0868fb2583c6ac!2sDattatreya%20Mandir%20Temple%2C%20Carapichaima%2C%20Trinidad%20and%20Tobago!3m2!1d10.4755332!2d-61.4315836!4m5!1s0x8c35fa82f493588f%3A0x401667f802b5070!2sSewdass%20Sadhu%20Shiva%20Mandir%20Temple%20in%20the%20Sea%2C%20Temple%2C%20Waterloo%2C%20Trinidad%20and%20Tobago!3m2!1d10.4816922!2d-61.4755472!4m5!1s0x8c358cfa3a951f7d%3A0x1c04ab58c8064b46!2sSan%20Fernando%20Hill%2C%20San%20Fernando%2C%20Trinidad%20and%20Tobago!3m2!1d10.2817507!2d-61.45616!4m5!1s0x8c3596bf9b282857%3A0x8a62a02a86b7e912!2sPitch%20Lake%2C%20New%20Jersey%2C%20Trinidad%20and%20Tobago!3m2!1d10.2325!2d-61.628056!4m5!1s0x8c35fc5028084c8d%3A0x4b88dab8a7a90142!2sCaroni%20Swamp%2C%20Trinidad%20and%20Tobago!3m2!1d10.5913889!2d-61.4552778!4m5!1s0x8c3607d0be7ebb55%3A0x2dd4764afb66c4d6!2sThe%20BRIX%2C%20Autograph%20Collection%2C%20Coblentz%20Avenue%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6730318!2d-61.5088929!5e0!3m2!1sen!2sus!4v1754155418943!5m2!1sen!2sus"
    />
  );

  let itinerary: { title: string; items: string[] };

  const maps = [SouthCoastTrindad];

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
        itinerary = TRINIDAD_AND_TOBAGO_POST_4.itineraries[section.layout.mapIndex];
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
          blogPath="trinidad-and-tobago/4"
        />;
      case "two-column":
        return (
          <TwoColumnLayout
            leftPane={{
              type: section.layout.leftType,
              imageUrl:
                section.layout.leftType === "image"
                  ? getImagePathFromBlogPost(TRINIDAD_AND_TOBAGO_POST_4, section.leftImage || "")
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
                  ? getImagePathFromBlogPost(TRINIDAD_AND_TOBAGO_POST_4, section.rightImage || "")
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
          backgroundImage: `url(${getImagePathFromBlogPost(TRINIDAD_AND_TOBAGO_POST_4, TRINIDAD_AND_TOBAGO_POST_4.backgroundImage || "")})`,
        }}
      >
        <div className="fixed-background-text-container">
          <div className="fixed-background-title fixed-background-no-margin">
            {TRINIDAD_AND_TOBAGO_POST_4.header}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="page-content">
          <div className="post-title">{TRINIDAD_AND_TOBAGO_POST_4.title}</div>

          <div className="post-subtitle">{TRINIDAD_AND_TOBAGO_POST_4.subtitle}</div>

          <div
            className="post-description"
            dangerouslySetInnerHTML={{ __html: TRINIDAD_AND_TOBAGO_POST_4.description }}
          />

          {TRINIDAD_AND_TOBAGO_POST_4.tipsSection && (
            <div className="post-bolded-text post-tips-section-container">
              {TRINIDAD_AND_TOBAGO_POST_4.tipsLink ? (
                <a
                  href={TRINIDAD_AND_TOBAGO_POST_4.tipsLink}
                  className="post-tips-link"
                  dangerouslySetInnerHTML={{ __html: TRINIDAD_AND_TOBAGO_POST_4.tipsSection }}
                />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: TRINIDAD_AND_TOBAGO_POST_4.tipsSection }} />
              )}
            </div>
          )}

          {TRINIDAD_AND_TOBAGO_POST_4.content.map((item, index) => (
            <div key={item.key || index}>
              {renderContent(item)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrinidadAndTobagoPost4;
