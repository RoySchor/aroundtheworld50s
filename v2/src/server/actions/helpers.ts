import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { blogPosts, tips } from "@/server/db/schema";

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

/**
 * Revalidate public tip paths if the tip is published.
 * Used after mutations to tip sections to bust the ISR cache.
 */
export async function revalidateTipPaths(tipId: string) {
  const tip = await db.query.tips.findFirst({
    where: eq(tips.id, tipId),
    columns: { slug: true, status: true },
  });
  if (tip?.status === "published") {
    revalidatePath("/");
    revalidatePath("/tips");
    revalidatePath(`/tips/${tip.slug}`);
  }
}
