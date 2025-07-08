import React from "react";
import "../../../../../styles/layout.css";
import "../../BlogPost.css";
import TwoColumnLayout from "../../../../../components/TwoColumnLayout/TwoColumnLayout";
import ImageGrid from "../../../../../components/ImageGrid/ImageGrid";
import MapEmbed from "../../../../../components/MapEmbed/MapEmbed";
import InstagramEmbedSection from "../../../../../pages/HomePage/components/InstagramEmbedSection";
import { TRINIDAD_AND_TOBAGO_POST_1 } from "./TrinidadandTobagoPost1.constants.ts";
import { ContentSection } from "./TrinidadandTobagoPost1.types";
import { getImagePathFromBlogPost } from "../../BlogPost.utils.ts";

const TrinidadandTobagoPost1 = () => {
  const Day1AfternoonOval = (
    <MapEmbed
      title="Day 1, Afternoon - Oval"
      url="https://www.google.com/maps/embed?pb=!1m46!1m12!1m3!1d15683.406750899996!2d-61.526615469279044!3d10.668617917798022!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m31!3e2!4m5!1s0x8c3607d0be7ebb55%3A0x2dd4764afb66c4d6!2sThe%20BRIX%2C%20Autograph%20Collection!3m2!1d10.6730318!2d-61.5088929!4m5!1s0x8c3607b9acef9d09%3A0xebc97d2236bdd499!2sQueen's%20Hall%2C%20Saint%20Ann's%20Road%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6726361!2d-61.510602299999995!4m5!1s0x8c360876ae030299%3A0x274e0b4cadf67adb!2sStollmeyer%E2%80%99s%20Castle%20Killarney%2C%20Maraval%20Road%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.672433!2d-61.518896899999994!4m5!1s0x8c36080d3b53e269%3A0x9e8e5c91a218eccb!2sQueen's%20Park%20Oval%2C%2094%20Tragarete%20Rd%2C%20Port%20of%20Spain%2C%20Trinidad%20%26%20Tobago!3m2!1d10.667366999999999!2d-61.523711!4m5!1s0x8c3607e0e1493be1%3A0x6309c523240869dd!2sMemorial%20Park%2C%20Frederick%20Street%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6636028!2d-61.509577799999995!5e0!3m2!1sen!2sus!4v1751425484096!5m2!1sen!2sus"
    />
  );

  const Day1AfternoonDowntown = (
    <MapEmbed
      title="Day 1, Afternoon- Downtown"
      url="https://www.google.com/maps/embed?pb=!1m52!1m12!1m3!1d15684.004408995012!2d-61.52428470154345!3d10.657021531751628!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m37!3e2!4m5!1s0x8c36080e40b8d411%3A0x6208586c6f6dc38f!2sAriapita%20Ave%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6617622!2d-61.523201099999994!4m5!1s0x8c3607e0e1493be1%3A0x6309c523240869dd!2sMemorial%20Park%2C%20MF7R%2BC5V%2C%20Frederick%20St%2C%20Port%20of%20Spain%2C%20Trinidad%20%26%20Tobago!3m2!1d10.6636028!2d-61.509577799999995!4m5!1s0x8c3607e288036ef9%3A0x151605af19573381!2sDowntown%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.659713499999999!2d-61.5121439!4m5!1s0x8c3607fc4b99ed0b%3A0x98beed9e7918873d!2sTrinity%20Cathedral%2C%20Abercromby%20Street%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6521017!2d-61.5105016!4m5!1s0x8c3607005d63b933%3A0x6d53250b28d09a8!2sCathedral%20of%20the%20Immaculate%20Conception%2C%20Independence%20Square%20South%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6497878!2d-61.507347499999995!4m5!1s0x8c3607feaf1fecf5%3A0xdc1681a7e287d238!2sIndependence%20Square%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6501178!2d-61.504768799999994!5e0!3m2!1sen!2sus!4v1751426311391!5m2!1sen!2sus"
    />
  );

  let itinerary: { title: string; items: string[] };

  const maps = [Day1AfternoonOval, Day1AfternoonDowntown];

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
        itinerary = TRINIDAD_AND_TOBAGO_POST_1.itineraries[section.layout.mapIndex];
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
        return <ImageGrid images={section.images || []} blogPath="trinidad-and-tobago/1" />;
      case "two-column":
        return (
          <TwoColumnLayout
            leftPane={{
              type: section.layout.leftType,
              imageUrl:
                section.layout.leftType === "image"
                  ? getImagePathFromBlogPost(TRINIDAD_AND_TOBAGO_POST_1, section.leftImage || "")
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
                  ? getImagePathFromBlogPost(TRINIDAD_AND_TOBAGO_POST_1, section.rightImage || "")
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
          backgroundImage: `url(${getImagePathFromBlogPost(TRINIDAD_AND_TOBAGO_POST_1, TRINIDAD_AND_TOBAGO_POST_1.backgroundImage || "")})`,
        }}
      >
        <div className="fixed-background-text-container">
          <div className="fixed-background-title fixed-background-no-margin">
            {TRINIDAD_AND_TOBAGO_POST_1.header}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="page-content">
          <div className="post-title">{TRINIDAD_AND_TOBAGO_POST_1.title}</div>

          <div className="post-subtitle">{TRINIDAD_AND_TOBAGO_POST_1.subtitle}</div>

          <div
            className="post-description"
            dangerouslySetInnerHTML={{ __html: TRINIDAD_AND_TOBAGO_POST_1.description }}
          />

          {TRINIDAD_AND_TOBAGO_POST_1.tipsSection && (
            <div className="post-bolded-text post-tips-section-container">
              {TRINIDAD_AND_TOBAGO_POST_1.tipsLink ? (
                <a
                  href={TRINIDAD_AND_TOBAGO_POST_1.tipsLink}
                  className="post-tips-link"
                  dangerouslySetInnerHTML={{ __html: TRINIDAD_AND_TOBAGO_POST_1.tipsSection }}
                />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: TRINIDAD_AND_TOBAGO_POST_1.tipsSection }} />
              )}
            </div>
          )}

          {TRINIDAD_AND_TOBAGO_POST_1.content.map((item, index) => (
            <div key={item.key || index}>
              {renderContent(item)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrinidadandTobagoPost1;
