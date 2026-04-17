"use server";

import { and, eq, gt, isNull, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { blogPosts, tips } from "@/server/db/schema";
import { getAuthenticatedAdmin } from "@/server/auth";
import {
  createBlogPostSchema,
  updateBlogPostSchema,
  slugify,
} from "@/server/validators/blog";
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

async function autoUnpublishTipIfEmpty(
  countrySlug: string,
  state: string | null,
) {
  const stateFilter = state
    ? eq(blogPosts.state, state)
    : isNull(blogPosts.state);

  const [remaining] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(blogPosts)
    .where(
      and(
        eq(blogPosts.countrySlug, countrySlug),
        stateFilter,
        eq(blogPosts.status, "published"),
      ),
    );

  if (Number(remaining?.count ?? 0) === 0) {
    const tipSlug = state ? slugify(state) : countrySlug;

    const [tip] = await db
      .update(tips)
      .set({ status: "draft", publishedAt: null })
      .where(and(eq(tips.slug, tipSlug), eq(tips.status, "published")))
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

export async function createBlogPost(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const profile = await getAuthenticatedAdmin();

  const parsed = createBlogPostSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Validation failed" };
  }

  const data = parsed.data;
  const countrySlug = slugify(data.country);
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

export async function updateBlogPost(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  await getAuthenticatedAdmin();

  const parsed = updateBlogPostSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Validation failed" };
  }

  const data = parsed.data;

  const [post] = await db
    .update(blogPosts)
    .set(data)
    .where(eq(blogPosts.id, id))
    .returning({
      countrySlug: blogPosts.countrySlug,
      postIndex: blogPosts.postIndex,
      status: blogPosts.status,
    });

  if (post?.status === "published") {
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
      state: blogPosts.state,
    });

  if (!post) {
    return { success: false, error: "Post not found" };
  }

  await autoUnpublishTipIfEmpty(post.countrySlug, post.state);
  revalidatePublicPaths(post.countrySlug, post.postIndex);
  return { success: true, data: undefined };
}

export async function deleteBlogPost(id: string): Promise<ActionResult> {
  await getAuthenticatedAdmin();

  // ---------------------------------------------------------------
  // 1. Delete + re-index in one transaction
  // ---------------------------------------------------------------
  const deleted = await db.transaction(async (tx) => {
    const [row] = await tx
      .delete(blogPosts)
      .where(eq(blogPosts.id, id))
      .returning({
        countrySlug: blogPosts.countrySlug,
        postIndex: blogPosts.postIndex,
        state: blogPosts.state,
      });

    if (!row) return null;

    await tx
      .update(blogPosts)
      .set({ postIndex: sql`${blogPosts.postIndex} - 1` })
      .where(
        and(
          eq(blogPosts.countrySlug, row.countrySlug),
          gt(blogPosts.postIndex, row.postIndex),
        ),
      );

    return row;
  });

  if (!deleted) {
    return { success: false, error: "Post not found" };
  }

  // ---------------------------------------------------------------
  // 2. Auto-unpublish tip if no published posts remain
  // ---------------------------------------------------------------
  await autoUnpublishTipIfEmpty(deleted.countrySlug, deleted.state);

  // ---------------------------------------------------------------
  // 3. Revalidate affected blog paths
  // ---------------------------------------------------------------
  const [totalRemaining] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(blogPosts)
    .where(eq(blogPosts.countrySlug, deleted.countrySlug));

  revalidateAfterDelete(
    deleted.countrySlug,
    deleted.postIndex,
    Number(totalRemaining?.count ?? 0),
  );

  // redirect() throws NEXT_REDIRECT — called outside the transaction
  redirect("/admin/blog");
}
