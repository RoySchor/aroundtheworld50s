import "server-only";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/server/db";
import { tips, tipSections } from "@/server/db/schema";

/** All tips (draft + published), newest first. Flat — no sections. */
export async function getAllTips() {
  return db.query.tips.findMany({
    orderBy: [desc(tips.createdAt)],
  });
}

/** Single tip with all sections (any status, any enabled state), or undefined. */
export async function getTipById(id: string) {
  return db.query.tips.findFirst({
    where: eq(tips.id, id),
    with: {
      sections: { orderBy: [asc(tipSections.position)] },
    },
  });
}
