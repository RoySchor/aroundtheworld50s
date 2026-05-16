import "server-only";
import { asc, sql } from "drizzle-orm";
import { db } from "@/server/db";
import { galleryImages } from "@/server/db/schema";

/** All gallery images ordered by position. */
export async function getAllGalleryImages() {
  return db.query.galleryImages.findMany({
    orderBy: [asc(galleryImages.position)],
  });
}

/** Highest current position, or -1 if the gallery is empty. */
export async function getMaxGalleryPosition(): Promise<number> {
  const result = await db
    .select({
      maxPos: sql<number>`COALESCE(MAX(${galleryImages.position}), -1)`,
    })
    .from(galleryImages);

  return result[0]?.maxPos ?? -1;
}
