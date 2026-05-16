import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { clientEnv } from "@/lib/env/client";

/**
 * Refreshes the Supabase auth session on every request. Called from
 * `src/middleware.ts`. Without this, access tokens expire and auth cookies
 * drift out of sync — especially under parallel requests, where Supabase's
 * single-use refresh tokens race each other.
 *
 * IMPORTANT: do not perform any other work between `getUser()` and returning
 * `supabaseResponse`. Any extra response mutation can drop the refreshed
 * auth cookies and silently log the user out.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Contacts the Supabase Auth server to verify the token and refresh it if
  // needed. Use getUser() (not getSession()) because we want a verified
  // identity, not whatever the cookie claims.
  await supabase.auth.getUser();

  return supabaseResponse;
}
