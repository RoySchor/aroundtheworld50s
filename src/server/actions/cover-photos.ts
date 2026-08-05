"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { countryCoverOverrides } from "@/server/db/schema";
import { getAuthenticatedAdmin } from "@/server/auth";
import type { ActionResult } from "./types";

function revalidateCoverPaths(countrySlug: string) {
  revalidatePath(`/blog/${countrySlug}`);
  revalidatePath("/destinations");
}

export async function setCoverOverride(
  countrySlug: string,
  coverImage: string,
): Promise<ActionResult> {
  await getAuthenticatedAdmin();

  if (!countrySlug || !coverImage) {
    return { success: false, error: "Country slug and image are required" };
  }

  await db.insert(countryCoverOverrides).values({ countrySlug, coverImage }).onConflictDoUpdate({
    target: countryCoverOverrides.countrySlug,
    set: { coverImage },
  });

  revalidateCoverPaths(countrySlug);
  return { success: true, data: undefined };
}

export async function removeCoverOverride(countrySlug: string): Promise<ActionResult> {
  await getAuthenticatedAdmin();

  if (!countrySlug) {
    return { success: false, error: "Country slug is required" };
  }

  const [row] = await db
    .delete(countryCoverOverrides)
    .where(eq(countryCoverOverrides.countrySlug, countrySlug))
    .returning({ id: countryCoverOverrides.id });

  if (!row) {
    return { success: false, error: "No override found for this country" };
  }

  revalidateCoverPaths(countrySlug);
  return { success: true, data: undefined };
}
