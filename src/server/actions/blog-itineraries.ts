"use server";

import { and, eq, gt, sql } from "drizzle-orm";
import { db } from "@/server/db";
import {
  blogBlocks,
  blogItineraries,
  blogItineraryItems,
} from "@/server/db/schema";
import { getAuthenticatedAdmin } from "@/server/auth";
import {
  createBlogItinerarySchema,
  updateBlogItinerarySchema,
  createBlogItineraryItemSchema,
  updateBlogItineraryItemSchema,
} from "@/server/validators/blog";
import type { ActionResult } from "./types";
import { revalidatePostPaths } from "./helpers";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getPostIdForItinerary(itineraryId: string): Promise<string | null> {
  const itin = await db.query.blogItineraries.findFirst({
    where: eq(blogItineraries.id, itineraryId),
    columns: { postId: true },
  });
  return itin?.postId ?? null;
}

// ---------------------------------------------------------------------------
// Itinerary actions
// ---------------------------------------------------------------------------

export async function createBlogItinerary(
  postId: string,
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  await getAuthenticatedAdmin();

  const parsed = createBlogItinerarySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Validation failed" };
  }

  const maxResult = await db
    .select({ maxPos: sql<number>`COALESCE(MAX(${blogItineraries.position}), -1)` })
    .from(blogItineraries)
    .where(eq(blogItineraries.postId, postId));

  const position = (maxResult[0]?.maxPos ?? -1) + 1;

  const [itin] = await db
    .insert(blogItineraries)
    .values({
      postId,
      position,
      title: parsed.data.title,
      mapEmbedUrl: parsed.data.mapEmbedUrl ?? null,
    })
    .returning({ id: blogItineraries.id });

  await revalidatePostPaths(postId);
  return { success: true, data: { id: itin.id } };
}

export async function updateBlogItinerary(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  await getAuthenticatedAdmin();

  const parsed = updateBlogItinerarySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Validation failed" };
  }

  const [itin] = await db
    .update(blogItineraries)
    .set(parsed.data)
    .where(eq(blogItineraries.id, id))
    .returning({ postId: blogItineraries.postId });

  if (itin) await revalidatePostPaths(itin.postId);
  return { success: true, data: undefined };
}

export async function deleteBlogItinerary(id: string): Promise<ActionResult> {
  await getAuthenticatedAdmin();

  const deleted = await db.transaction(async (tx) => {
    const [row] = await tx
      .delete(blogItineraries)
      .where(eq(blogItineraries.id, id))
      .returning({ postId: blogItineraries.postId, position: blogItineraries.position });

    if (!row) return null;

    // Re-number itinerary positions
    await tx
      .update(blogItineraries)
      .set({ position: sql`${blogItineraries.position} - 1` })
      .where(
        and(
          eq(blogItineraries.postId, row.postId),
          gt(blogItineraries.position, row.position),
        ),
      );

    // Cascade: delete content blocks that referenced this itinerary
    const orphanedBlocks = await tx
      .select({ id: blogBlocks.id })
      .from(blogBlocks)
      .where(
        and(
          eq(blogBlocks.postId, row.postId),
          eq(blogBlocks.type, "itinerary_with_map"),
          sql`${blogBlocks.data}->>'itineraryId' = ${id}`,
        ),
      );

    if (orphanedBlocks.length > 0) {
      // Delete all orphaned blocks first
      for (const orphan of orphanedBlocks) {
        await tx.delete(blogBlocks).where(eq(blogBlocks.id, orphan.id));
      }

      // Single renumbering pass using ROW_NUMBER
      await tx.execute(sql`
        UPDATE blog_blocks
        SET position = sub.new_pos
        FROM (
          SELECT id, ROW_NUMBER() OVER (ORDER BY position) - 1 AS new_pos
          FROM blog_blocks
          WHERE post_id = ${row.postId}
        ) sub
        WHERE blog_blocks.id = sub.id
      `);
    }

    return row;
  });

  if (!deleted) return { success: false, error: "Itinerary not found" };

  await revalidatePostPaths(deleted.postId);
  return { success: true, data: undefined };
}

export async function reorderBlogItinerary(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  await getAuthenticatedAdmin();

  const itin = await db.query.blogItineraries.findFirst({
    where: eq(blogItineraries.id, id),
    columns: { id: true, postId: true, position: true },
  });
  if (!itin) return { success: false, error: "Itinerary not found" };

  const adjacent = await db.query.blogItineraries.findFirst({
    where: and(
      eq(blogItineraries.postId, itin.postId),
      direction === "up"
        ? eq(blogItineraries.position, itin.position - 1)
        : eq(blogItineraries.position, itin.position + 1),
    ),
    columns: { id: true, position: true },
  });
  if (!adjacent) return { success: false, error: `Cannot move ${direction}` };

  await db.transaction(async (tx) => {
    await tx.execute(sql`SET CONSTRAINTS blog_itineraries_post_position_unique DEFERRED`);
    await tx.update(blogItineraries).set({ position: adjacent.position }).where(eq(blogItineraries.id, itin.id));
    await tx.update(blogItineraries).set({ position: itin.position }).where(eq(blogItineraries.id, adjacent.id));
  });

  await revalidatePostPaths(itin.postId);
  return { success: true, data: undefined };
}

// ---------------------------------------------------------------------------
// Itinerary item actions
// ---------------------------------------------------------------------------

export async function createBlogItineraryItem(
  itineraryId: string,
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  await getAuthenticatedAdmin();

  const parsed = createBlogItineraryItemSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Validation failed" };
  }

  const maxResult = await db
    .select({ maxPos: sql<number>`COALESCE(MAX(${blogItineraryItems.position}), -1)` })
    .from(blogItineraryItems)
    .where(eq(blogItineraryItems.itineraryId, itineraryId));

  const position = (maxResult[0]?.maxPos ?? -1) + 1;

  const [item] = await db
    .insert(blogItineraryItems)
    .values({ itineraryId, position, content: parsed.data.content })
    .returning({ id: blogItineraryItems.id });

  const postId = await getPostIdForItinerary(itineraryId);
  if (postId) await revalidatePostPaths(postId);
  return { success: true, data: { id: item.id } };
}

export async function updateBlogItineraryItem(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  await getAuthenticatedAdmin();

  const parsed = updateBlogItineraryItemSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Validation failed" };
  }

  const [item] = await db
    .update(blogItineraryItems)
    .set(parsed.data)
    .where(eq(blogItineraryItems.id, id))
    .returning({ itineraryId: blogItineraryItems.itineraryId });

  if (item) {
    const postId = await getPostIdForItinerary(item.itineraryId);
    if (postId) await revalidatePostPaths(postId);
  }
  return { success: true, data: undefined };
}

export async function deleteBlogItineraryItem(
  id: string,
): Promise<ActionResult> {
  await getAuthenticatedAdmin();

  const deleted = await db.transaction(async (tx) => {
    const [row] = await tx
      .delete(blogItineraryItems)
      .where(eq(blogItineraryItems.id, id))
      .returning({
        itineraryId: blogItineraryItems.itineraryId,
        position: blogItineraryItems.position,
      });

    if (!row) return null;

    await tx
      .update(blogItineraryItems)
      .set({ position: sql`${blogItineraryItems.position} - 1` })
      .where(
        and(
          eq(blogItineraryItems.itineraryId, row.itineraryId),
          gt(blogItineraryItems.position, row.position),
        ),
      );

    return row;
  });

  if (!deleted) return { success: false, error: "Item not found" };

  const postId = await getPostIdForItinerary(deleted.itineraryId);
  if (postId) await revalidatePostPaths(postId);
  return { success: true, data: undefined };
}

export async function reorderBlogItineraryItem(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  await getAuthenticatedAdmin();

  const item = await db.query.blogItineraryItems.findFirst({
    where: eq(blogItineraryItems.id, id),
    columns: { id: true, itineraryId: true, position: true },
  });
  if (!item) return { success: false, error: "Item not found" };

  const adjacent = await db.query.blogItineraryItems.findFirst({
    where: and(
      eq(blogItineraryItems.itineraryId, item.itineraryId),
      direction === "up"
        ? eq(blogItineraryItems.position, item.position - 1)
        : eq(blogItineraryItems.position, item.position + 1),
    ),
    columns: { id: true, position: true },
  });
  if (!adjacent) return { success: false, error: `Cannot move ${direction}` };

  await db.transaction(async (tx) => {
    await tx.execute(sql`SET CONSTRAINTS blog_itinerary_items_itinerary_position_unique DEFERRED`);
    await tx.update(blogItineraryItems).set({ position: adjacent.position }).where(eq(blogItineraryItems.id, item.id));
    await tx.update(blogItineraryItems).set({ position: item.position }).where(eq(blogItineraryItems.id, adjacent.id));
  });

  const postId = await getPostIdForItinerary(item.itineraryId);
  if (postId) await revalidatePostPaths(postId);
  return { success: true, data: undefined };
}
