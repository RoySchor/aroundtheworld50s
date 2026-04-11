import { z } from "zod";

/**
 * Environment variables available on both the client and the server.
 *
 * This schema is the single source of truth for what env vars the app needs.
 * If you see a parse error, it will tell you exactly which variable is
 * missing or malformed in .env.local.
 *
 * Next.js inlines `process.env.NEXT_PUBLIC_*` references at build time, so
 * each variable below must be accessed via its literal name — no dynamic
 * lookups, no destructuring of `process.env` itself.
 */
const ClientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("must be the Supabase project URL (https://<ref>.supabase.co)"),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .min(1, "Supabase publishable (anon) key — safe to ship to the browser"),
});

const parsed = ClientEnvSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
});

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(`Invalid client environment variables. Set them in .env.local:\n${issues}`);
}

export const clientEnv = parsed.data;
