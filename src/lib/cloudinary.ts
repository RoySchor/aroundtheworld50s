import { CLOUDINARY_BASE_URL, CLOUDINARY_ASSET_PREFIX } from "@/lib/constants";

const OPTIMIZATIONS = "f_auto,q_auto";

/**
 * Build a full Cloudinary URL for any public_id with optional transformations.
 */
export function buildCloudinaryUrl(publicId: string, transformations?: string): string {
  const transforms = transformations ? `${OPTIMIZATIONS},${transformations}` : OPTIMIZATIONS;
  return `${CLOUDINARY_BASE_URL}/${transforms}/${publicId}`;
}

/**
 * Pre-built public_ids for static assets used across the site.
 * Static assets retain file extensions in their public_ids (matching how they
 * were uploaded to Cloudinary). Blog/gallery images stored in the DB have
 * extensions stripped — Cloudinary's f_auto handles format negotiation.
 */
export const STATIC_ASSETS = {
  logo: `${CLOUDINARY_ASSET_PREFIX}/around_the_world_50s_logo.png`,
  homePageBg: `${CLOUDINARY_ASSET_PREFIX}/home-page-bg.webp`,
  aboutMePageBg: `${CLOUDINARY_ASSET_PREFIX}/about-me-page-bg.webp`,
  destinationsPageBg: `${CLOUDINARY_ASSET_PREFIX}/destinations-page-bg.jpg`,
  flatWorldMap: `${CLOUDINARY_ASSET_PREFIX}/flat-world-map.webp`,
  errorPageGif: `${CLOUDINARY_ASSET_PREFIX}/error-page-gif.gif`,
  errorPageGifNoBg: `${CLOUDINARY_ASSET_PREFIX}/error-page-gif-no-bg.gif`,
} as const;
