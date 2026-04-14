"use server";

import { getAuthenticatedAdmin } from "@/server/auth";
import { uploadImage as cloudinaryUpload } from "@/server/services/cloudinary";

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Upload an image via FormData. Expects a "file" field and an optional "folder" field.
 * Returns the Cloudinary public_id on success.
 */
export async function uploadImage(
  formData: FormData,
): Promise<ActionResult<{ publicId: string }>> {
  await getAuthenticatedAdmin();

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { success: false, error: "No file provided" };
  }

  if (!file.type.startsWith("image/")) {
    return { success: false, error: "File must be an image" };
  }

  const folder =
    (formData.get("folder") as string | null) ?? "aroundtheworld50s/uploads";

  try {
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const result = await cloudinaryUpload(dataUri, folder);
    return { success: true, data: result };
  } catch (err) {
    console.error("Image upload failed:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Upload failed",
    };
  }
}
