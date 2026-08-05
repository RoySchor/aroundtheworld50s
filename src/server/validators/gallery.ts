import "server-only";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Gallery image schemas
// ---------------------------------------------------------------------------

export const createGalleryImageSchema = z.object({
  cloudinaryPublicId: z.string().min(1, "Cloudinary public_id is required"),
  caption: z.string().nullable().optional(),
});

export const updateGalleryImageSchema = z.object({
  caption: z.string().nullable().optional(),
});

// ---------------------------------------------------------------------------
// Exported types
// ---------------------------------------------------------------------------

export type CreateGalleryImageInput = z.infer<typeof createGalleryImageSchema>;
export type UpdateGalleryImageInput = z.infer<typeof updateGalleryImageSchema>;
