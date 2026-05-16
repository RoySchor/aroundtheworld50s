import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/server/db";
import { tips, tipSections } from "@/server/db/schema";

/** All published tips, newest first. Flat — no sections. */
export async function getPublishedTips() {
  return db.query.tips.findMany({
    where: eq(tips.status, "published"),
    orderBy: [desc(tips.createdAt)],
  });
}

/** Single published tip with enabled sections ordered by position, or undefined. */
export async function getTipBySlug(slug: string) {
  return db.query.tips.findFirst({
    where: and(eq(tips.slug, slug), eq(tips.status, "published")),
    with: {
      sections: {
        where: eq(tipSections.enabled, true),
        orderBy: [asc(tipSections.position)],
      },
    },
  });
}
