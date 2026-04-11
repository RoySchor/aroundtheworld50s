import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { clientEnv } from "@/lib/env/client";

/**
 * Supabase client for use in Server Components, Route Handlers, and Server
 * Actions. Reads the user session from the Next.js cookie store so
 * `auth.uid()` works server-side.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // `set` throws when called from a Server Component.
            // Safe to ignore — the middleware in src/middleware.ts is
            // responsible for refreshing the session cookie.
          }
        },
      },
    },
  );
}
