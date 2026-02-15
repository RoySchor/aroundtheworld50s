// Cloudinary configuration and URL utilities
const CLOUD_NAME = "dgfx5h5jl";
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;
const ASSET_PREFIX = "aroundtheworld50s";

// Optimization transformations - auto format (webp when supported) + auto quality
const OPTIMIZATIONS = "f_auto,q_auto";

/**
 * Get Cloudinary URL for a static asset (root level images)
 * @param {string} filename - The image filename (e.g., "home-page-bg.webp")
 * @returns {string} Full Cloudinary URL
 */
export const getStaticAssetUrl = (filename) => {
  return `${BASE_URL}/${OPTIMIZATIONS}/${ASSET_PREFIX}/${filename}`;
};

/**
 * Get Cloudinary URL for a blog image
 * @param {string} blogPath - The blog path (e.g., "trinidad-and-tobago/1")
 * @param {string} imageName - The image filename (e.g., "IMG_1234.jpeg")
 * @returns {string} Full Cloudinary URL
 */
export const getBlogImageUrl = (blogPath, imageName) => {
  return `${BASE_URL}/${OPTIMIZATIONS}/${ASSET_PREFIX}/blog/${blogPath}/${imageName}`;
};

/**
 * Get Cloudinary URL for a home page gallery image
 * @param {string} imageName - The image filename
 * @returns {string} Full Cloudinary URL
 */
export const getGalleryImageUrl = (imageName) => {
  return `${BASE_URL}/${OPTIMIZATIONS}/${ASSET_PREFIX}/homePageGallery/${imageName}`;
};

// Static asset URLs for easy importing
export const STATIC_ASSETS = {
  logo: getStaticAssetUrl("around_the_world_50s_logo.png"),
  homePageBg: getStaticAssetUrl("home-page-bg.webp"),
  aboutMePageBg: getStaticAssetUrl("about-me-page-bg.webp"),
  destinationsPageBg: getStaticAssetUrl("destinations-page-bg.jpg"),
  flatWorldMap: getStaticAssetUrl("flat-world-map.webp"),
  errorPageGif: getStaticAssetUrl("error-page-gif.gif"),
  errorPageGifNoBg: getStaticAssetUrl("error-page-gif-no-bg.gif"),
};

export default {
  CLOUD_NAME,
  BASE_URL,
  ASSET_PREFIX,
  getStaticAssetUrl,
  getBlogImageUrl,
  getGalleryImageUrl,
  STATIC_ASSETS,
};
