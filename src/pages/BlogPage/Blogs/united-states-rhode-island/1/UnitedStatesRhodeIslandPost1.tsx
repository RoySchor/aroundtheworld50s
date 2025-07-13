import React from "react";
import "../../../../../styles/layout.css";
import "../../BlogPost.css";
import TwoColumnLayout from "../../../../../components/TwoColumnLayout/TwoColumnLayout";
import ImageGrid from "../../../../../components/ImageGrid/ImageGrid";
import MapEmbed from "../../../../../components/MapEmbed/MapEmbed";
import InstagramEmbedSection from "../../../../../pages/HomePage/components/InstagramEmbedSection";
import { UNITED_STATES_RHODE_ISLAND_POST_1 } from "./UnitedStatesRhodeIslandPost1.constants.ts";
import { ContentSection } from "./UnitedStatesRhodeIslandPost1.types";
import { getImagePathFromBlogPost } from "../../BlogPost.utils.ts";

const UnitedStatesRhodeIslandPost1 = () => {
  const Providenceri = (
    <MapEmbed
      title="Proidence_RI"
      url="https://www.google.com/maps/embed?pb=!1m70!1m12!1m3!1d11892.474399397393!2d-71.42466018584844!3d41.82574423995734!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m55!3e0!4m5!1s0x89e4451a576adb33%3A0x4e520f7525043b6d!2sRhode%20Island%20State%20House%2C%2082%20Smith%20St%2C%20Providence%2C%20RI%2002903!3m2!1d41.8307662!2d-71.4153037!4m5!1s0x89e44561d263f5df%3A0xb6db537995a8ed00!2sStation%20Park%2C%20Francis%20Street%2C%20Providence%2C%20RI!3m2!1d41.828679!2d-71.4144681!4m5!1s0x89e44510e1520037%3A0x622cd3cfc6974b20!2sWaterplace%20Park%2C%20Memorial%20Boulevard%2C%20Providence%2C%20RI!3m2!1d41.8274486!2d-71.4139414!4m5!1s0x89e44516a9e45fbd%3A0x775bd7cd62b056db!2sCity%20Center%2FPVD%20Rink%2C%20Kennedy%20Plaza%2C%20Providence%2C%20RI!3m2!1d41.8247174!2d-71.412699!4m5!1s0x89e445f52d38b965%3A0x2aaf090b4267b9a1!2sIndependence%20Trail%2C%20Weybosset%20Street%2C%20Providence%2C%20RI!3m2!1d41.8241344!2d-71.4096587!4m5!1s0x89e445128c461b3d%3A0x579937acaabea29f!2sTrinity%20Brewhouse%2C%20Fountain%20Street%2C%20Providence%2C%20RI!3m2!1d41.8223797!2d-71.4167566!4m5!1s0x89e4452490b38e29%3A0xb7e69fcf7a220cb!2sBrown%20University%2C%20Providence%2C%20RI!3m2!1d41.826771799999996!2d-71.4025482!4m5!1s0x89e44523720b327b%3A0x3e3fcdc8a8c57a21!2sCollege%20Hill%2C%20Providence%2C%20RI!3m2!1d41.830156699999996!2d-71.4032189!4m5!1s0x89e445750dc608fb%3A0x38113e9694689256!2sFederal%20Hill%2C%20Providence%2C%20RI!3m2!1d41.8198338!2d-71.4293903!5e0!3m2!1sen!2sus!4v1752421099391!5m2!1sen!2sus"
    />
  );

  let itinerary: { title: string; items: string[] };

  const maps = [Providenceri];

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
        itinerary = UNITED_STATES_RHODE_ISLAND_POST_1.itineraries[section.layout.mapIndex];
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
        return <ImageGrid images={section.images || []} blogPath="united-states-rhode-island/1" />;
      case "two-column":
        return (
          <TwoColumnLayout
            leftPane={{
              type: section.layout.leftType,
              imageUrl:
                section.layout.leftType === "image"
                  ? getImagePathFromBlogPost(UNITED_STATES_RHODE_ISLAND_POST_1, section.leftImage || "")
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
                  ? getImagePathFromBlogPost(UNITED_STATES_RHODE_ISLAND_POST_1, section.rightImage || "")
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
          backgroundImage: `url(${getImagePathFromBlogPost(UNITED_STATES_RHODE_ISLAND_POST_1, UNITED_STATES_RHODE_ISLAND_POST_1.backgroundImage || "")})`,
        }}
      >
        <div className="fixed-background-text-container">
          <div className="fixed-background-title fixed-background-no-margin">
            {UNITED_STATES_RHODE_ISLAND_POST_1.header}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="page-content">
          <div className="post-title">{UNITED_STATES_RHODE_ISLAND_POST_1.title}</div>

          <div className="post-subtitle">{UNITED_STATES_RHODE_ISLAND_POST_1.subtitle}</div>

          <div
            className="post-description"
            dangerouslySetInnerHTML={{ __html: UNITED_STATES_RHODE_ISLAND_POST_1.description }}
          />

          {UNITED_STATES_RHODE_ISLAND_POST_1.tipsSection && (
            <div className="post-bolded-text post-tips-section-container">
              {UNITED_STATES_RHODE_ISLAND_POST_1.tipsLink ? (
                <a
                  href={UNITED_STATES_RHODE_ISLAND_POST_1.tipsLink}
                  className="post-tips-link"
                  dangerouslySetInnerHTML={{ __html: UNITED_STATES_RHODE_ISLAND_POST_1.tipsSection }}
                />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: UNITED_STATES_RHODE_ISLAND_POST_1.tipsSection }} />
              )}
            </div>
          )}

          {UNITED_STATES_RHODE_ISLAND_POST_1.content.map((item, index) => (
            <div key={item.key || index}>
              {renderContent(item)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UnitedStatesRhodeIslandPost1;
