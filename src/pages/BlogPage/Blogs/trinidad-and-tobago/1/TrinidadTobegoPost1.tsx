import React from "react";
import "../../../../../styles/layout.css";
import "../../BlogPost.css";
import TwoColumnLayout from "../../../../../components/TwoColumnLayout/TwoColumnLayout";
import ImageGrid from "../../../../../components/ImageGrid/ImageGrid";
import MapEmbed from "../../../../../components/MapEmbed/MapEmbed";
import { TRINIDAD_TOBAGO_POST_1 } from "./TrinidadTobegoPost1.constants.ts";
import { ContentSection } from "./TrinidadTobegoPost1.types";

const TrinidadTobegoPost1 = () => {
  const portOfSpainMap = (
    <MapEmbed
      title="Port of Spain Map"
      url="https://www.google.com/maps/embed?pb=!1m52!1m12!1m3!1d15683.427881537722!2d-61.524383801540914!3d10.668208131583249!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m37!3e0!4m5!1s0x8c3607d0be7ebb55%3A0x2dd4764afb66c4d6!2sThe%20BRIX%2C%20Autograph%20Collection%2C%20Coblentz%20Avenue%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6730318!2d-61.5088929!4m5!1s0x8c3607b9acef9d09%3A0xebc97d2236bdd499!2sQueen&#39;s%20Hall%2C%201-3%20St%20Ann&#39;s%20Rd%2C%20Port%20of%20Spain%2C%20Trinidad%20%26%20Tobago!3m2!1d10.6726361!2d-61.510602299999995!4m5!1s0x8c36080ae020b87d%3A0x9331045e7a215764!2sQueen&#39;s%20Park%20W%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6665236!2d-61.5163863!4m5!1s0x8c360876ae030299%3A0x274e0b4cadf67adb!2sStollmeyer%E2%80%99s%20Castle%20Killarney%2C%2031%20Maraval%20Road%2C%20Port%20of%20Spain%2C%20Trinidad%20%26%20Tobago!3m2!1d10.672433!2d-61.518896899999994!4m5!1s0x8c3607e0e1493be1%3A0x6309c523240869dd!2sMF7R%2BC5V%20Memorial%20Park%2C%20Frederick%20St%2C%20Port%20of%20Spain%2C%20Trinidad%20%26%20Tobago!3m2!1d10.6636028!2d-61.509577799999995!4m5!1s0x8c3608757d0f84eb%3A0x7891e3ceea281d80!2sQueen&#39;s%20Park%20Savannah%2C%2011%20Queen&#39;s%20Park%20E%2C%20Port%20of%20Spain%2C%20Trinidad%20%26%20Tobago!3m2!1d10.6687426!2d-61.514367699999994!5e0!3m2!1sen!2sus!4v1743990738788!5m2!1sen!2sus"
    />
  );

  const downtownMap = (
    <MapEmbed
      title="Downtown Port of Spain Map"
      url="https://www.google.com/maps/embed?pb=!1m52!1m12!1m3!1d15684.004408995012!2d-61.52428470154345!3d10.657021531751628!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m37!3e2!4m5!1s0x8c36080e40b8d411%3A0x6208586c6f6dc38f!2sAriapita%20Ave%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6617622!2d-61.523201099999994!4m5!1s0x8c3607e0e1493be1%3A0x6309c523240869dd!2sMemorial%20Park%2C%20MF7R%2BC5V%2C%20Frederick%20St%2C%20Port%20of%20Spain%2C%20Trinidad%20%26%20Tobago!3m2!1d10.6636028!2d-61.509577799999995!4m5!1s0x8c3607e288036ef9%3A0x151605af19573381!2sDowntown%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.659713499999999!2d-61.5121439!4m5!1s0x8c3607fc4b99ed0b%3A0x98beed9e7918873d!2sTrinity%20Cathedral%2C%20Abercromby%20Street%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6521017!2d-61.5105016!4m5!1s0x8c3607005d63b933%3A0x6d53250b28d09a8!2sCathedral%20of%20the%20Immaculate%20Conception%2C%20Independence%20Square%20South%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6497878!2d-61.507347499999995!4m5!1s0x8c3607feaf1fecf5%3A0xdc1681a7e287d238!2sIndependence%20Square%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6501178!2d-61.504768799999994!5e0!3m2!1sen!2sus!4v1744001699541!5m2!1sen!2sus"
    />
  );

  let itinerary: { title: string; items: string[] };

  const maps = [portOfSpainMap, downtownMap];

  const renderContent = (section: ContentSection) => {
    switch (section.layout.type) {
      case "text":
        return (
          <div key={section.key} className="post-description">
            {section.content}
          </div>
        );
      case "itinerary-with-map":
        itinerary = TRINIDAD_TOBAGO_POST_1.itineraries[section.layout.mapIndex];
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
        return <ImageGrid images={section.images || []} />;
      case "two-column":
        return (
          <TwoColumnLayout
            leftPane={{
              type: section.layout.leftType,
              imageUrl:
                section.layout.leftType === "image"
                  ? require(
                      `../../../../../assets/blog/trinidad-and-tobago/1/${section.leftImage}`,
                    )
                  : undefined,
              imageAlt: "Port of Spain",
              content:
                section.layout.leftType === "text"
                  ? section.content
                  : undefined,
            }}
            rightPane={{
              type: section.layout.rightType,
              imageUrl:
                section.layout.rightType === "image"
                  ? require(
                      `../../../../../assets/blog/trinidad-and-tobago/1/${section.rightImage}`,
                    )
                  : undefined,
              imageAlt: "Port of Spain",
              content:
                section.layout.rightType === "text"
                  ? section.content
                  : undefined,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="page-container">
      <div
        className="fixed-background-container"
        style={{
          backgroundImage: `url(${require(
            `../../../../../assets/blog/trinidad-and-tobago/1/${TRINIDAD_TOBAGO_POST_1.backgroundImage}`,
          )})`,
        }}
      >
        <div className="fixed-background-text-container">
          <div className="fixed-background-title fixed-background-no-margin">
            {TRINIDAD_TOBAGO_POST_1.header}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="page-content">
          <div className="post-title">{TRINIDAD_TOBAGO_POST_1.title}</div>

          <div className="post-subtitle">{TRINIDAD_TOBAGO_POST_1.subtitle}</div>

          <div className="post-description">
            {TRINIDAD_TOBAGO_POST_1.description}
          </div>

          {TRINIDAD_TOBAGO_POST_1.tipsSection && (
            <div className="post-bolded-text post-tips-section-container">
              {TRINIDAD_TOBAGO_POST_1.tipsSection}
            </div>
          )}

          {TRINIDAD_TOBAGO_POST_1.content.map((item, index) => (
            <div key={item.key || index}>
              {renderContent(item)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrinidadTobegoPost1;