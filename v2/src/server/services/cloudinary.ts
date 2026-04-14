import "server-only";
import { v2 as cloudinary } from "cloudinary";
import { serverEnv } from "@/lib/env/server";

// ---------------------------------------------------------------------------
// Configure on first import
// ---------------------------------------------------------------------------

let configured = false;

function ensureConfigured() {
  if (configured) return;

  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    serverEnv;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error(
      "Cloudinary credentials missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.local",
    );
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });

  configured = true;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Upload an image to Cloudinary from a base64 data URI.
 * Returns the public_id (e.g. "aroundtheworld50s/blog/my-country/1/IMG_1234").
 */
export async function uploadImage(
  base64DataUri: string,
  folder: string,
): Promise<{ publicId: string }> {
  ensureConfigured();

  const result = await cloudinary.uploader.upload(base64DataUri, {
    folder,
    resource_type: "image",
  });

  return { publicId: result.public_id };
}

/** Delete an image from Cloudinary by public_id. */
export async function deleteImage(publicId: string): Promise<void> {
  ensureConfigured();
  await cloudinary.uploader.destroy(publicId);
}
