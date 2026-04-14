"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { tips, tipSections } from "@/server/db/schema";
import { getAuthenticatedAdmin } from "@/server/auth";
import {
  createTipSchema,
  updateTipSchema,
  updateTipSectionSchema,
} from "@/server/validators/tips";
import { TIP_SECTIONS } from "@/lib/constants/tip-sections";
import type { ActionResult } from "./types";
import { revalidateTipPaths } from "./helpers";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function revalidatePublicTipPaths(slug: string) {
  revalidatePath("/");
  revalidatePath("/tips");
  revalidatePath(`/tips/${slug}`);
}

// ---------------------------------------------------------------------------
// Tip CRUD
// ---------------------------------------------------------------------------

export async function createTip(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  await getAuthenticatedAdmin();

  const parsed = createTipSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Validation failed",
    };
  }

  const data = parsed.data;

  try {
    const tip = await db.transaction(async (tx) => {
      const [row] = await tx
        .insert(tips)
        .values({
          slug: data.slug,
          country: data.country,
          countryCode: data.countryCode,
          state: data.state ?? null,
          title: data.title,
          description: data.description ?? null,
          status: data.status,
          publishedAt: data.status === "published" ? new Date() : null,
        })
        .returning({ id: tips.id });

      // Auto-create all 6 sections (disabled, empty content)
      await tx.insert(tipSections).values(
        TIP_SECTIONS.map((section, idx) => ({
          tipId: row.id,
          sectionKey: section.key as typeof tipSections.$inferInsert.sectionKey,
          content: null,
          enabled: false,
          position: idx,
        })),
      );

      return row;
    });

    // redirect() throws NEXT_REDIRECT — the ActionResult return type only applies to the error path above
    redirect(`/admin/tips/${tip.id}`);
  } catch (err) {
    // Re-throw Next.js redirect
    if (err instanceof Error && err.message === "NEXT_REDIRECT") throw err;

    // Handle unique constraint violation on slug
    const pgErr = err as { code?: string };
    if (pgErr.code === "23505") {
      return {
        success: false,
        error: "A tip with this slug already exists",
      };
    }

    throw err;
  }
}

export async function updateTip(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  await getAuthenticatedAdmin();

  const parsed = updateTipSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Validation failed",
    };
  }

  const data = parsed.data;

  // If slug is being changed, we need to revalidate the old path too
  let oldSlug: string | null = null;
  if (data.slug) {
    const existing = await db.query.tips.findFirst({
      where: eq(tips.id, id),
      columns: { slug: true },
    });
    if (existing && existing.slug !== data.slug) {
      oldSlug = existing.slug;
    }
  }

  const [tip] = await db
    .update(tips)
    .set(data)
    .where(eq(tips.id, id))
    .returning({
      slug: tips.slug,
      status: tips.status,
    });

  if (tip?.status === "published") {
    revalidatePublicTipPaths(tip.slug);
    if (oldSlug) {
      revalidatePublicTipPaths(oldSlug);
    }
  }

  return { success: true, data: undefined };
}

export async function publishTip(id: string): Promise<ActionResult> {
  await getAuthenticatedAdmin();

  const [tip] = await db
    .update(tips)
    .set({ status: "published", publishedAt: new Date() })
    .where(eq(tips.id, id))
    .returning({ slug: tips.slug });

  if (!tip) {
    return { success: false, error: "Tip not found" };
  }

  revalidatePublicTipPaths(tip.slug);
  return { success: true, data: undefined };
}

export async function unpublishTip(id: string): Promise<ActionResult> {
  await getAuthenticatedAdmin();

  const [tip] = await db
    .update(tips)
    .set({ status: "draft", publishedAt: null })
    .where(eq(tips.id, id))
    .returning({ slug: tips.slug });

  if (!tip) {
    return { success: false, error: "Tip not found" };
  }

  revalidatePublicTipPaths(tip.slug);
  return { success: true, data: undefined };
}

export async function deleteTip(id: string): Promise<ActionResult> {
  await getAuthenticatedAdmin();

  const [tip] = await db
    .delete(tips)
    .where(eq(tips.id, id))
    .returning({ slug: tips.slug });

  if (!tip) {
    return { success: false, error: "Tip not found" };
  }

  revalidatePublicTipPaths(tip.slug);
  // redirect() throws NEXT_REDIRECT — the ActionResult return type only applies to the error path above
  redirect("/admin/tips");
}

// ---------------------------------------------------------------------------
// Section actions
// ---------------------------------------------------------------------------

export async function updateTipSection(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  await getAuthenticatedAdmin();

  const parsed = updateTipSectionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Validation failed",
    };
  }

  const [section] = await db
    .update(tipSections)
    .set(parsed.data)
    .where(eq(tipSections.id, id))
    .returning({ tipId: tipSections.tipId });

  if (section) await revalidateTipPaths(section.tipId);
  return { success: true, data: undefined };
}

export async function reorderTipSection(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  await getAuthenticatedAdmin();

  const section = await db.query.tipSections.findFirst({
    where: eq(tipSections.id, id),
    columns: { id: true, tipId: true, position: true },
  });

  if (!section) {
    return { success: false, error: "Section not found" };
  }

  const adjacent = await db.query.tipSections.findFirst({
    where: and(
      eq(tipSections.tipId, section.tipId),
      direction === "up"
        ? eq(tipSections.position, section.position - 1)
        : eq(tipSections.position, section.position + 1),
    ),
    columns: { id: true, position: true },
  });

  if (!adjacent) {
    return { success: false, error: `Cannot move ${direction}` };
  }

  await db.transaction(async (tx) => {
    await tx.execute(
      sql`SET CONSTRAINTS tip_sections_tip_id_position_unique DEFERRED`,
    );
    await tx
      .update(tipSections)
      .set({ position: adjacent.position })
      .where(eq(tipSections.id, section.id));
    await tx
      .update(tipSections)
      .set({ position: section.position })
      .where(eq(tipSections.id, adjacent.id));
  });

  await revalidateTipPaths(section.tipId);
  return { success: true, data: undefined };
}
