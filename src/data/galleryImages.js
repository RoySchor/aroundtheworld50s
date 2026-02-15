// Dynamic gallery images from Cloudinary
// No hardcoded list - fetches directly from Cloudinary at runtime

const CLOUD_NAME = "dgfx5h5jl";
const GALLERY_FOLDER = "aroundtheworld50s/homePageGallery";
const OPTIMIZATIONS = "f_auto,q_auto";

// Cloudinary resource list uses TAGS, not folder paths
// All gallery images must be tagged with "homePageGallery" in Cloudinary
const GALLERY_TAG = "homePageGallery";

// Cloudinary resource list URL (requires "Resource list" enabled in Cloudinary settings)
export const GALLERY_LIST_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${GALLERY_TAG}.json`;

/**
 * Build a Cloudinary URL for a gallery image
 */
export const buildGalleryUrl = (publicId, format = "jpg") => {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${OPTIMIZATIONS}/${publicId}.${format}`;
};

/**
 * Fetch gallery images from Cloudinary
 * Returns array of image URLs
 */
export const fetchGalleryImages = async () => {
  try {
    const response = await fetch(GALLERY_LIST_URL);
    if (!response.ok) {
      console.warn("Could not fetch gallery list from Cloudinary. Using fallback.");
      return getFallbackImages();
    }
    const data = await response.json();
    return data.resources.map((resource) => buildGalleryUrl(resource.public_id, resource.format));
  } catch (error) {
    console.warn("Error fetching gallery images:", error);
    return getFallbackImages();
  }
};

// Fallback in case Cloudinary list is not enabled or fails
const getFallbackImages = () => {
  // This is only used if the Cloudinary API fails
  // These are the images that were in the gallery as of the last update
  const fallbackNames = [
    "20171226_102228_Original.JPG",
    "20180402_131039_Original.JPG",
    "IMG_0145.JPG",
    "IMG_1361.jpeg",
    "IMG_9775.jpeg",
  ];
  return fallbackNames.map(
    (name) => `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${OPTIMIZATIONS}/${GALLERY_FOLDER}/${name}`
  );
};

export default { fetchGalleryImages, buildGalleryUrl, GALLERY_LIST_URL };
