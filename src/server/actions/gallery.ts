"use server";

import { eq, gt, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { galleryImages } from "@/server/db/schema";
import { getAuthenticatedAdmin } from "@/server/auth";
import { createGalleryImageSchema, updateGalleryImageSchema } from "@/server/validators/gallery";
import { deleteImage } from "@/server/services/cloudinary";
import { getMaxGalleryPosition } from "@/server/repositories/admin-gallery";
import type { ActionResult } from "./types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Revalidate homepage — currently the only page rendering the gallery slider. */
function revalidateGallery() {
  revalidatePath("/");
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export async function createGalleryImage(input: unknown): Promise<ActionResult<{ id: string }>> {
  await getAuthenticatedAdmin();

  const parsed = createGalleryImageSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Validation failed",
    };
  }

  const position = (await getMaxGalleryPosition()) + 1;

  try {
    const [row] = await db
      .insert(galleryImages)
      .values({
        cloudinaryPublicId: parsed.data.cloudinaryPublicId,
        caption: parsed.data.caption ?? null,
        position,
      })
      .returning({ id: galleryImages.id });

    revalidateGallery();
    return { success: true, data: { id: row.id } };
  } catch (err) {
    const pgErr = err as { code?: string };
    if (pgErr.code === "23505") {
      // Clean up the Cloudinary asset that was uploaded before the DB insert failed
      try {
        await deleteImage(parsed.data.cloudinaryPublicId);
      } catch {
        // Best-effort cleanup
      }
      return {
        success: false,
        error: "This image is already in the gallery",
      };
    }
    throw err;
  }
}

export async function updateGalleryImage(id: string, input: unknown): Promise<ActionResult> {
  await getAuthenticatedAdmin();

  const parsed = updateGalleryImageSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Validation failed",
    };
  }

  const [row] = await db
    .update(galleryImages)
    .set(parsed.data)
    .where(eq(galleryImages.id, id))
    .returning({ id: galleryImages.id });

  if (!row) {
    return { success: false, error: "Image not found" };
  }

  revalidateGallery();
  return { success: true, data: undefined };
}

export async function deleteGalleryImage(id: string): Promise<ActionResult> {
  await getAuthenticatedAdmin();

  const deleted = await db.transaction(async (tx) => {
    const [row] = await tx.delete(galleryImages).where(eq(galleryImages.id, id)).returning({
      cloudinaryPublicId: galleryImages.cloudinaryPublicId,
      position: galleryImages.position,
    });

    if (!row) return null;

    // Re-number positions above the deleted image
    await tx
      .update(galleryImages)
      .set({ position: sql`${galleryImages.position} - 1` })
      .where(gt(galleryImages.position, row.position));

    return row;
  });

  if (!deleted) {
    return { success: false, error: "Image not found" };
  }

  // Clean up from Cloudinary (best-effort — don't fail the action if this errors)
  try {
    await deleteImage(deleted.cloudinaryPublicId);
  } catch (err) {
    console.error("Cloudinary delete failed:", err);
  }

  revalidateGallery();
  return { success: true, data: undefined };
}

export async function reorderGalleryImage(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  await getAuthenticatedAdmin();

  const image = await db.query.galleryImages.findFirst({
    where: eq(galleryImages.id, id),
    columns: { id: true, position: true },
  });

  if (!image) {
    return { success: false, error: "Image not found" };
  }

  const adjacent = await db.query.galleryImages.findFirst({
    where:
      direction === "up"
        ? eq(galleryImages.position, image.position - 1)
        : eq(galleryImages.position, image.position + 1),
    columns: { id: true, position: true },
  });

  if (!adjacent) {
    return { success: false, error: `Cannot move ${direction}` };
  }

  await db.transaction(async (tx) => {
    await tx.execute(sql`SET CONSTRAINTS gallery_images_position_unique DEFERRED`);
    await tx
      .update(galleryImages)
      .set({ position: adjacent.position })
      .where(eq(galleryImages.id, image.id));
    await tx
      .update(galleryImages)
      .set({ position: image.position })
      .where(eq(galleryImages.id, adjacent.id));
  });

  revalidateGallery();
  return { success: true, data: undefined };
}
