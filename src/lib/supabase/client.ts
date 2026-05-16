import { createBrowserClient } from "@supabase/ssr";
import { clientEnv } from "@/lib/env/client";

/**
 * Supabase client for use in Client Components.
 * Reads only public env vars — safe to ship to the browser.
 */
export function createClient() {
  return createBrowserClient(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
