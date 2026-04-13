import { buildCloudinaryUrl, STATIC_ASSETS } from "./cloudinary";

export const SITE_URL = "https://aroundtheworld50s.com";

/** Generate a 1200x630 OG image URL from a Cloudinary public_id. */
export function getOgImageUrl(publicId: string): string {
  return buildCloudinaryUrl(publicId, "w_1200,h_630,c_fill,g_auto");
}

/** Default OG image for pages without a specific image. */
export const DEFAULT_OG_IMAGE = getOgImageUrl(STATIC_ASSETS.homePageBg);
