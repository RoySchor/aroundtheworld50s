"use server";

import { and, eq, gt, sql } from "drizzle-orm";
import { db } from "@/server/db";
import { blogBlocks } from "@/server/db/schema";
import { getAuthenticatedAdmin } from "@/server/auth";
import { blogBlockDataSchema } from "@/server/validators/blog";
import type { ActionResult } from "./types";
import { revalidatePostPaths } from "./helpers";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getMaxBlockPosition(postId: string): Promise<number> {
  const result = await db
    .select({
      maxPos: sql<number>`COALESCE(MAX(${blogBlocks.position}), -1)`,
    })
    .from(blogBlocks)
    .where(eq(blogBlocks.postId, postId));

  return result[0]?.maxPos ?? -1;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export async function createBlogBlock(
  postId: string,
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  await getAuthenticatedAdmin();

  const parsed = blogBlockDataSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Validation failed",
    };
  }

  const { type, ...data } = parsed.data;
  const position = (await getMaxBlockPosition(postId)) + 1;

  const [block] = await db
    .insert(blogBlocks)
    .values({ postId, position, type, data })
    .returning({ id: blogBlocks.id });

  await revalidatePostPaths(postId);
  return { success: true, data: { id: block.id } };
}

export async function updateBlogBlock(id: string, input: unknown): Promise<ActionResult> {
  await getAuthenticatedAdmin();

  const parsed = blogBlockDataSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Validation failed",
    };
  }

  const { type, ...data } = parsed.data;

  const [block] = await db
    .update(blogBlocks)
    .set({ type, data })
    .where(eq(blogBlocks.id, id))
    .returning({ postId: blogBlocks.postId });

  if (block) await revalidatePostPaths(block.postId);
  return { success: true, data: undefined };
}

export async function deleteBlogBlock(id: string): Promise<ActionResult> {
  await getAuthenticatedAdmin();

  const deleted = await db.transaction(async (tx) => {
    const [row] = await tx.delete(blogBlocks).where(eq(blogBlocks.id, id)).returning({
      postId: blogBlocks.postId,
      position: blogBlocks.position,
    });

    if (!row) return null;

    // Re-number positions above the deleted block
    await tx
      .update(blogBlocks)
      .set({ position: sql`${blogBlocks.position} - 1` })
      .where(and(eq(blogBlocks.postId, row.postId), gt(blogBlocks.position, row.position)));

    return row;
  });

  if (!deleted) {
    return { success: false, error: "Block not found" };
  }

  await revalidatePostPaths(deleted.postId);
  return { success: true, data: undefined };
}

export async function reorderBlogBlock(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  await getAuthenticatedAdmin();

  const block = await db.query.blogBlocks.findFirst({
    where: eq(blogBlocks.id, id),
    columns: { id: true, postId: true, position: true },
  });

  if (!block) {
    return { success: false, error: "Block not found" };
  }

  // Find the adjacent block to swap with
  const adjacent = await db.query.blogBlocks.findFirst({
    where: and(
      eq(blogBlocks.postId, block.postId),
      direction === "up"
        ? eq(blogBlocks.position, block.position - 1)
        : eq(blogBlocks.position, block.position + 1),
    ),
    columns: { id: true, position: true },
  });

  if (!adjacent) {
    return { success: false, error: `Cannot move ${direction}` };
  }

  // Swap positions in a transaction (deferred constraint allows this)
  await db.transaction(async (tx) => {
    await tx.execute(sql`SET CONSTRAINTS blog_blocks_post_position_unique DEFERRED`);
    await tx
      .update(blogBlocks)
      .set({ position: adjacent.position })
      .where(eq(blogBlocks.id, block.id));
    await tx
      .update(blogBlocks)
      .set({ position: block.position })
      .where(eq(blogBlocks.id, adjacent.id));
  });

  await revalidatePostPaths(block.postId);
  return { success: true, data: undefined };
}
