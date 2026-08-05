"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Flag from "react-world-flags";
import { STATIC_ASSETS } from "@/lib/cloudinary";
import { locationCoordinates } from "@/lib/constants/world-map-coordinates";

export interface MapLocationData {
  locationKey: string;
  displayName: string;
  countrySlug: string;
  countryCode: string;
  backgroundImage: string | null;
}

interface WorldMapProps {
  locations: MapLocationData[];
}

export function WorldMap({ locations }: WorldMapProps) {
  const [hoveredLocation, setHoveredLocation] = useState<MapLocationData | null>(null);

  return (
    <div className="world-map-container">
      <Image
        src={STATIC_ASSETS.flatWorldMap}
        alt="World Map"
        width={1200}
        height={600}
        className="w-full h-auto"
        priority
      />

      {locations.map((location) => {
        const coordinates = locationCoordinates[location.locationKey];
        if (!coordinates) return null;

        return (
          <Link key={location.locationKey} href={`/blog/${location.countrySlug}`}>
            <div
              className="country-box-selector"
              style={{
                left: coordinates.left,
                top: coordinates.top,
                transform: "translate(-50%, -50%)",
              }}
              onMouseEnter={() => setHoveredLocation(location)}
              onMouseLeave={() => setHoveredLocation(null)}
            >
              {hoveredLocation?.locationKey === location.locationKey && (
                <div className="flag-pole">
                  <div className="flag">
                    <Flag code={location.countryCode} alt={location.displayName} />
                  </div>
                </div>
              )}
            </div>
          </Link>
        );
      })}

      {hoveredLocation && (
        <div className="hover-info-container">
          {hoveredLocation.backgroundImage && (
            <div className="hover-info-image-container">
              <Image
                src={hoveredLocation.backgroundImage}
                alt={hoveredLocation.displayName}
                fill
                className="object-cover"
                sizes="112px"
              />
            </div>
          )}

          <div className="hover-info-country-blog-container">
            <div className="hover-info-country-blog-title">{hoveredLocation.displayName}</div>
          </div>
        </div>
      )}
    </div>
  );
}
