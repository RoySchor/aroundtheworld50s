import type { Metadata } from "next";
import { getPublishedPosts } from "@/server/repositories/blog";

export const dynamic = "force-dynamic";
import { buildCloudinaryUrl, STATIC_ASSETS } from "@/lib/cloudinary";
import { SITE_NAME } from "@/lib/constants";
import { getOgImageUrl } from "@/lib/seo";
import { DestinationDropdown } from "@/components/destinations/DestinationDropdown";
import { WorldMap } from "@/components/destinations/WorldMap";
import type { MapLocationData } from "@/components/destinations/WorldMap";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Explore all the destinations we've visited around the world on an interactive map.",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    images: [
      {
        url: getOgImageUrl(STATIC_ASSETS.destinationsPageBg),
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default async function DestinationsPage() {
  const posts = await getPublishedPosts();

  // Derive unique locations from published posts
  const seen = new Set<string>();
  const mapLocations: MapLocationData[] = [];
  for (const post of posts) {
    const locationKey =
      post.state && post.countryCode === "US"
        ? `USA-${post.state}`
        : post.country;
    if (seen.has(locationKey)) continue;
    seen.add(locationKey);
    mapLocations.push({
      locationKey,
      displayName: post.state
        ? `${post.state}, ${post.country}`
        : post.country,
      countrySlug: post.countrySlug,
      countryCode: post.countryCode,
      backgroundImage: post.backgroundImage,
    });
  }
  const sortedLocations = mapLocations.sort((a, b) =>
    a.displayName.localeCompare(b.displayName),
  );

  const heroUrl = buildCloudinaryUrl(
    STATIC_ASSETS.destinationsPageBg,
    "w_1920",
  );

  return (
    <div className="page-container">
      <div
        className="parallax-hero"
        style={{ backgroundImage: `url(${heroUrl})` }}
      >
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="parallax-hero-title">Choose your destinations</h1>
        </div>
      </div>

      <div className="container">
        <DestinationDropdown locations={sortedLocations} />
        <div className="page-content">
          <WorldMap locations={sortedLocations} />
        </div>
      </div>
    </div>
  );
}
