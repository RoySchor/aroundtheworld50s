import React from "react";
import "../../../../../styles/layout.css";
import "../../BlogPost.css";
import TwoColumnLayout from "../../../../../components/TwoColumnLayout/TwoColumnLayout";
import ImageGrid from "../../../../../components/ImageGrid/ImageGrid";
import MapEmbed from "../../../../../components/MapEmbed/MapEmbed";
import InstagramEmbedSection from "../../../../../pages/HomePage/components/InstagramEmbedSection";
import { UNITED_STATES_NEW_ENGLAND_POST_1 } from "./UnitedStatesNewEnglandPost1.constants.ts";
import { ContentSection } from "./UnitedStatesNewEnglandPost1.types";
import { getImagePathFromBlogPost } from "../../BlogPost.utils.ts";

const UnitedStatesNewEnglandPost1 = () => {
  const PlymouthMA = (
    <MapEmbed
      title="Plymouth_MA"
      url="https://www.google.com/maps/embed?pb=!1m64!1m12!1m3!1d23738.949656133063!2d-70.66618172767274!3d41.94941490894363!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m49!3e0!4m5!1s0x89e4bae73892b4ab%3A0xba3eed0190bd4b74!2sPilgrim%20Memorial%20State%20Park%2C%2079%20Water%20St%2C%20Plymouth%2C%20MA%2002360!3m2!1d41.958966!2d-70.662252!4m5!1s0x89e4bb177d3b91c5%3A0x48904cb0a3c9c782!2sFishmans%20Memorial%20Park%2C%20120%20Water%20St%2C%20Plymouth%2C%20MA%2002360!3m2!1d41.9607344!2d-70.6663907!4m5!1s0x89e4baddf5a6d0e5%3A0x4ea307a42b936531!2sMayflower%20II%2C%20Water%20Street%2C%20Plymouth%2C%20MA!3m2!1d41.9598064!2d-70.6621394!4m5!1s0x89e4bae723353103%3A0xa8e104ec582dd9ee!2sPlymouth%20Rock%2C%20Water%20Street%2C%20Plymouth%2C%20MA!3m2!1d41.9580674!2d-70.6621376!4m5!1s0x89e4bae1593744f7%3A0x53ab7054bd3c2e1c!2sFirst%20Parish%20in%20Plymouth%2C%20Church%20Street%2C%20Plymouth%2C%20MA!3m2!1d41.9550015!2d-70.6654217!4m5!1s0x89e4bae308301d27%3A0x3b83655f86602dac!2sPlimoth%20Grist%20Mill%2C%20Spring%20Lane%2C%20Plymouth%2C%20MA!3m2!1d41.9535604!2d-70.6652416!4m5!1s0x89e4bae129555555%3A0xb9d26af5e7b83c2f!2sPlymouth%20Village%20Historic%20District%2C%20Middle%20St%2C%20Plymouth%2C%20MA%2002360!3m2!1d41.9574718!2d-70.6636893!4m5!1s0x89e4ba829c616caf%3A0xdf1c5a6e1b55868f!2sPlimoth%20Patuxet%20Museums%2C%20Warren%20Avenue%2C%20Plymouth%2C%20MA!3m2!1d41.938099099999995!2d-70.6253663!5e0!3m2!1sen!2sus!4v1752353213936!5m2!1sen!2sus"
    />
  );

  let itinerary: { title: string; items: string[] };

  const maps = [PlymouthMA];

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
        itinerary = UNITED_STATES_NEW_ENGLAND_POST_1.itineraries[section.layout.mapIndex];
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
        return <ImageGrid images={section.images || []} blogPath="united-states-new-england/1" />;
      case "two-column":
        return (
          <TwoColumnLayout
            leftPane={{
              type: section.layout.leftType,
              imageUrl:
                section.layout.leftType === "image"
                  ? getImagePathFromBlogPost(UNITED_STATES_NEW_ENGLAND_POST_1, section.leftImage || "")
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
                  ? getImagePathFromBlogPost(UNITED_STATES_NEW_ENGLAND_POST_1, section.rightImage || "")
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
          backgroundImage: `url(${getImagePathFromBlogPost(UNITED_STATES_NEW_ENGLAND_POST_1, UNITED_STATES_NEW_ENGLAND_POST_1.backgroundImage || "")})`,
        }}
      >
        <div className="fixed-background-text-container">
          <div className="fixed-background-title fixed-background-no-margin">
            {UNITED_STATES_NEW_ENGLAND_POST_1.header}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="page-content">
          <div className="post-title">{UNITED_STATES_NEW_ENGLAND_POST_1.title}</div>

          <div className="post-subtitle">{UNITED_STATES_NEW_ENGLAND_POST_1.subtitle}</div>

          <div
            className="post-description"
            dangerouslySetInnerHTML={{ __html: UNITED_STATES_NEW_ENGLAND_POST_1.description }}
          />

          {UNITED_STATES_NEW_ENGLAND_POST_1.tipsSection && (
            <div className="post-bolded-text post-tips-section-container">
              {UNITED_STATES_NEW_ENGLAND_POST_1.tipsLink ? (
                <a
                  href={UNITED_STATES_NEW_ENGLAND_POST_1.tipsLink}
                  className="post-tips-link"
                  dangerouslySetInnerHTML={{ __html: UNITED_STATES_NEW_ENGLAND_POST_1.tipsSection }}
                />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: UNITED_STATES_NEW_ENGLAND_POST_1.tipsSection }} />
              )}
            </div>
          )}

          {UNITED_STATES_NEW_ENGLAND_POST_1.content.map((item, index) => (
            <div key={item.key || index}>
              {renderContent(item)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UnitedStatesNewEnglandPost1;
