import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { blogPosts } from "@/server/db/schema";

/**
 * Revalidate public blog paths for a post if it is published.
 * Used after mutations to blocks, itineraries, and items to bust the ISR cache.
 */
export async function revalidatePostPaths(postId: string) {
  const post = await db.query.blogPosts.findFirst({
    where: eq(blogPosts.id, postId),
    columns: { countrySlug: true, postIndex: true, status: true },
  });
  if (post?.status === "published") {
    revalidatePath(`/blog/${post.countrySlug}/${post.postIndex}`);
  }
}
