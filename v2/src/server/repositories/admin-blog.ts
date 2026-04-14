import "server-only";
import { asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/server/db";
import {
  blogBlocks,
  blogItineraries,
  blogItineraryItems,
  blogPosts,
} from "@/server/db/schema";

/** All posts (draft + published), newest first. Flat — no blocks or itineraries. */
export async function getAllPosts() {
  return db.query.blogPosts.findMany({
    orderBy: [desc(blogPosts.createdAt)],
  });
}

/** Single post with all nested content (any status), or undefined. */
export async function getPostById(id: string) {
  return db.query.blogPosts.findFirst({
    where: eq(blogPosts.id, id),
    with: {
      blocks: { orderBy: [asc(blogBlocks.position)] },
      itineraries: {
        orderBy: [asc(blogItineraries.position)],
        with: {
          items: { orderBy: [asc(blogItineraryItems.position)] },
        },
      },
    },
  });
}

/** Next available postIndex for a countrySlug (1-based). */
export async function getNextPostIndex(
  countrySlug: string,
): Promise<number> {
  const result = await db
    .select({ maxIndex: sql<number>`COALESCE(MAX(${blogPosts.postIndex}), 0)` })
    .from(blogPosts)
    .where(eq(blogPosts.countrySlug, countrySlug));

  return (result[0]?.maxIndex ?? 0) + 1;
}
