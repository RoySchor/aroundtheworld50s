import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/server/db";
import { blogBlocks, blogItineraries, blogItineraryItems, blogPosts } from "@/server/db/schema";

/** All published posts, newest first. Flat — no blocks or itineraries. */
export async function getPublishedPosts() {
  return db.query.blogPosts.findMany({
    where: eq(blogPosts.status, "published"),
    orderBy: [desc(blogPosts.publishedAt), desc(blogPosts.createdAt)],
  });
}

/** Single published post with all nested content, or undefined. */
export async function getPostBySlugAndIndex(countrySlug: string, postIndex: number) {
  return db.query.blogPosts.findFirst({
    where: and(
      eq(blogPosts.countrySlug, countrySlug),
      eq(blogPosts.postIndex, postIndex),
      eq(blogPosts.status, "published"),
    ),
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

/** Published posts for a country slug, newest first. Flat. */
export async function getPostsByCountrySlug(countrySlug: string) {
  return db.query.blogPosts.findMany({
    where: and(eq(blogPosts.countrySlug, countrySlug), eq(blogPosts.status, "published")),
    orderBy: [desc(blogPosts.publishedAt), desc(blogPosts.createdAt)],
  });
}
