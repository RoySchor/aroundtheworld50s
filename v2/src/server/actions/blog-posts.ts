"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { blogPosts } from "@/server/db/schema";
import { getAuthenticatedAdmin } from "@/server/auth";
import {
  createBlogPostSchema,
  updateBlogPostSchema,
  slugify,
} from "@/server/validators/blog";
import { getNextPostIndex } from "@/server/repositories/admin-blog";
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
    });

  if (!post) {
    return { success: false, error: "Post not found" };
  }

  revalidatePublicPaths(post.countrySlug, post.postIndex);
  return { success: true, data: undefined };
}

export async function deleteBlogPost(id: string): Promise<ActionResult> {
  await getAuthenticatedAdmin();

  const [post] = await db
    .delete(blogPosts)
    .where(eq(blogPosts.id, id))
    .returning({
      countrySlug: blogPosts.countrySlug,
      postIndex: blogPosts.postIndex,
    });

  if (!post) {
    return { success: false, error: "Post not found" };
  }

  revalidatePublicPaths(post.countrySlug, post.postIndex);
  // redirect() throws NEXT_REDIRECT — the ActionResult return type only applies to the error path above
  redirect("/admin/blog");
}
