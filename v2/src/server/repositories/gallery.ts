import { asc } from "drizzle-orm";
import { db } from "@/server/db";
import { galleryImages } from "@/server/db/schema";

/** All gallery images ordered by position. */
export async function getGalleryImages() {
  return db.query.galleryImages.findMany({
    orderBy: [asc(galleryImages.position)],
  });
}
