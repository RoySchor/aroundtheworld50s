import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/server/db";
import { profiles } from "@/server/db/schema";
import { eq } from "drizzle-orm";

/**
 * Returns the admin profile if the current user is authenticated with the
 * admin role, or `null` otherwise. Does NOT redirect — callers decide what
 * to do with a null result (e.g. show a login form vs. redirect).
 *
 * Wrapped with React `cache()` so that multiple calls within the same
 * server render (e.g. layout + page) hit Supabase and the DB only once.
 */
export const getAdminProfileIfAuthenticated = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [profile] = await db.select().from(profiles).where(eq(profiles.id, user.id)).limit(1);

  if (!profile || profile.role !== "admin") return null;

  return profile;
});

/**
 * Verifies the current user is authenticated AND has the admin role.
 * Returns the profile row on success; redirects to /login on failure.
 *
 * Call this in server components and server actions that require admin access.
 */
export async function getAuthenticatedAdmin() {
  const profile = await getAdminProfileIfAuthenticated();
  if (!profile) redirect("/login");
  return profile;
}
