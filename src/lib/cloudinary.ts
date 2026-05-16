import {
  CLOUDINARY_BASE_URL,
  CLOUDINARY_ASSET_PREFIX,
} from "@/lib/constants";

const OPTIMIZATIONS = "f_auto,q_auto";

/**
 * Build a full Cloudinary URL for any public_id with optional transformations.
 */
export function buildCloudinaryUrl(
  publicId: string,
  transformations?: string
): string {
  const transforms = transformations
    ? `${OPTIMIZATIONS},${transformations}`
    : OPTIMIZATIONS;
  return `${CLOUDINARY_BASE_URL}/${transforms}/${publicId}`;
}

/**
 * Get URL for a static asset stored at aroundtheworld50s/<filename>.
 * Use for assets not tracked in the database (logo, backgrounds, etc.).
 */
export function getStaticAssetUrl(filename: string): string {
  return buildCloudinaryUrl(`${CLOUDINARY_ASSET_PREFIX}/${filename}`);
}

/**
 * Get URL for a blog image.
 * v2 DB stores full public_ids (e.g. "aroundtheworld50s/blog/trinidad-and-tobago/1/IMG_1355"),
 * so this just passes through to buildCloudinaryUrl.
 */
export function getBlogImageUrl(publicId: string): string {
  return buildCloudinaryUrl(publicId);
}

/**
 * Get URL for a gallery image.
 * v2 DB stores full public_ids, so this passes through to buildCloudinaryUrl.
 */
export function getGalleryImageUrl(publicId: string): string {
  return buildCloudinaryUrl(publicId);
}

/**
 * Next.js <Image> custom loader for Cloudinary.
 * Use as: <Image loader={cloudinaryLoader} src={publicId} ... />
 *
 * Builds its own transform string instead of going through buildCloudinaryUrl,
 * because the loader needs w_ and optionally q_ without the default q_auto.
 */
export function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  const transforms = quality
    ? `f_auto,w_${width},q_${quality}`
    : `f_auto,q_auto,w_${width}`;
  return `${CLOUDINARY_BASE_URL}/${transforms}/${src}`;
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
