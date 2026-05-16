"use server";

import { getAuthenticatedAdmin } from "@/server/auth";
import { uploadImage as cloudinaryUpload } from "@/server/services/cloudinary";
import type { ActionResult } from "./types";

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

  if (file.size > 10 * 1024 * 1024) {
    return { success: false, error: "File must be under 10MB" };
  }

  const folder =
    (formData.get("folder") as string | null) ?? "aroundtheworld50s/uploads";

  if (!folder.startsWith("aroundtheworld50s/")) {
    return { success: false, error: "Invalid upload folder" };
  }

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
