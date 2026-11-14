"use server";

import { and, eq, gt, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { blogPosts, tips } from "@/server/db/schema";
import { getAuthenticatedAdmin } from "@/server/auth";
import { createBlogPostSchema, updateBlogPostSchema } from "@/server/validators/blog";
import { locationSlug } from "@/lib/slugify";
import { getNextPostIndex } from "@/server/repositories/admin-blog";
import { revalidatePublicTipPaths } from "./helpers";
import type { ActionResult } from "./types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function revalidatePublicPaths(countrySlug: string, postIndex: number) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${countrySlug}`);
  revalidatePath(`/blog/${countrySlug}/${postIndex}`);
}

// Tips share the post's location slug, so a slug with no published posts left
// means its tip page has nothing to link back to.
async function autoUnpublishTipIfEmpty(countrySlug: string) {
  const [remaining] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(blogPosts)
    .where(and(eq(blogPosts.countrySlug, countrySlug), eq(blogPosts.status, "published")));

  if (Number(remaining?.count ?? 0) === 0) {
    const [tip] = await db
      .update(tips)
      .set({ status: "draft", publishedAt: null })
      .where(and(eq(tips.slug, countrySlug), eq(tips.status, "published")))
      .returning({ slug: tips.slug });

    if (tip) {
      revalidatePublicTipPaths(tip.slug);
    }
  }
}

function revalidateAfterDelete(
  countrySlug: string,
  deletedPostIndex: number,
  totalRemainingInSlug: number,
) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${countrySlug}`);
  for (let i = deletedPostIndex; i <= totalRemainingInSlug + 1; i++) {
    revalidatePath(`/blog/${countrySlug}/${i}`);
  }
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export async function createBlogPost(input: unknown): Promise<ActionResult<{ id: string }>> {
  const profile = await getAuthenticatedAdmin();

  const parsed = createBlogPostSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Validation failed" };
  }

  const data = parsed.data;
  const countrySlug = locationSlug(data.country, data.state);
  const postIndex = await getNextPostIndex(countrySlug);

  const [post] = await db
    .insert(blogPosts)
    .values({
      countrySlug,
      postIndex,
      country: data.country,
      countryCode: data.countryCode,
      state: data.state ?? null,
      title: data.title,
      subtitle: data.subtitle ?? null,
      header: data.header ?? null,
      description: data.description ?? null,
      excerpt: data.excerpt ?? null,
      backgroundImage: data.backgroundImage ?? null,
      tipsCtaCopy: data.tipsCtaCopy ?? null,
      tipsSlug: data.tipsSlug ?? null,
      status: data.status,
      publishedAt: data.status === "published" ? new Date() : null,
      authorId: profile.id,
    })
    .returning({ id: blogPosts.id });

  // redirect() throws NEXT_REDIRECT — the ActionResult return type only applies to the error path above
  redirect(`/admin/blog/${post.id}`);
}

export async function updateBlogPost(id: string, input: unknown): Promise<ActionResult> {
  await getAuthenticatedAdmin();

  const parsed = updateBlogPostSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Validation failed" };
  }

  const data = parsed.data;

  // Changing a post's state changes its location slug, so the post moves
  // to the end of the new slug's list and the old list is re-indexed to stay
  // contiguous (same rule as delete).
  const result = await db.transaction(async (tx) => {
    const existing = await tx.query.blogPosts.findFirst({
      where: eq(blogPosts.id, id),
      columns: { country: true, countrySlug: true, postIndex: true },
    });
    if (!existing) return null;

    const newSlug =
      data.state === undefined ? existing.countrySlug : locationSlug(existing.country, data.state);
    const moved = newSlug !== existing.countrySlug;

    let newIndex = existing.postIndex;
    if (moved) {
      const [target] = await tx
        .select({ count: sql<number>`COUNT(*)` })
        .from(blogPosts)
        .where(eq(blogPosts.countrySlug, newSlug));
      newIndex = Number(target?.count ?? 0) + 1;
    }

    const [post] = await tx
      .update(blogPosts)
      .set({ ...data, countrySlug: newSlug, postIndex: newIndex })
      .where(eq(blogPosts.id, id))
      .returning({
        countrySlug: blogPosts.countrySlug,
        postIndex: blogPosts.postIndex,
        status: blogPosts.status,
      });

    if (moved) {
      await tx
        .update(blogPosts)
        .set({ postIndex: sql`${blogPosts.postIndex} - 1` })
        .where(
          and(
            eq(blogPosts.countrySlug, existing.countrySlug),
            gt(blogPosts.postIndex, existing.postIndex),
          ),
        );
    }

    return { post, previous: moved ? existing : null };
  });

  if (!result) {
    return { success: false, error: "Post not found" };
  }

  const { post, previous } = result;

  if (previous) {
    await autoUnpublishTipIfEmpty(previous.countrySlug);
    const [remaining] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(blogPosts)
      .where(eq(blogPosts.countrySlug, previous.countrySlug));
    revalidateAfterDelete(previous.countrySlug, previous.postIndex, Number(remaining?.count ?? 0));
  }

  if (post.status === "published") {
    revalidatePublicPaths(post.countrySlug, post.postIndex);
  }

  return { success: true, data: undefined };
}

export async function publishBlogPost(id: string): Promise<ActionResult> {
  await getAuthenticatedAdmin();

  const [post] = await db
    .update(blogPosts)
    .set({ status: "published", publishedAt: new Date() })
    .where(eq(blogPosts.id, id))
    .returning({
      countrySlug: blogPosts.countrySlug,
      postIndex: blogPosts.postIndex,
    });

  if (!post) {
    return { success: false, error: "Post not found" };
  }

  revalidatePublicPaths(post.countrySlug, post.postIndex);
  return { success: true, data: undefined };
}

export async function unpublishBlogPost(id: string): Promise<ActionResult> {
  await getAuthenticatedAdmin();

  const [post] = await db
    .update(blogPosts)
    .set({ status: "draft", publishedAt: null })
    .where(eq(blogPosts.id, id))
    .returning({
      countrySlug: blogPosts.countrySlug,
      postIndex: blogPosts.postIndex,
    });

  if (!post) {
    return { success: false, error: "Post not found" };
  }

  await autoUnpublishTipIfEmpty(post.countrySlug);
  revalidatePublicPaths(post.countrySlug, post.postIndex);
  return { success: true, data: undefined };
}

export async function deleteBlogPost(id: string): Promise<ActionResult> {
  await getAuthenticatedAdmin();

  // ---------------------------------------------------------------
  // 1. Delete + re-index in one transaction
  // ---------------------------------------------------------------
  const deleted = await db.transaction(async (tx) => {
    const [row] = await tx.delete(blogPosts).where(eq(blogPosts.id, id)).returning({
      countrySlug: blogPosts.countrySlug,
      postIndex: blogPosts.postIndex,
    });

    if (!row) return null;

    await tx
      .update(blogPosts)
      .set({ postIndex: sql`${blogPosts.postIndex} - 1` })
      .where(
        and(eq(blogPosts.countrySlug, row.countrySlug), gt(blogPosts.postIndex, row.postIndex)),
      );

    return row;
  });

  if (!deleted) {
    return { success: false, error: "Post not found" };
  }

  // ---------------------------------------------------------------
  // 2. Auto-unpublish tip if no published posts remain
  // ---------------------------------------------------------------
  await autoUnpublishTipIfEmpty(deleted.countrySlug);

  // ---------------------------------------------------------------
  // 3. Revalidate affected blog paths
  // ---------------------------------------------------------------
  const [totalRemaining] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(blogPosts)
    .where(eq(blogPosts.countrySlug, deleted.countrySlug));

  revalidateAfterDelete(deleted.countrySlug, deleted.postIndex, Number(totalRemaining?.count ?? 0));

  // redirect() throws NEXT_REDIRECT — called outside the transaction
  redirect("/admin/blog");
}
