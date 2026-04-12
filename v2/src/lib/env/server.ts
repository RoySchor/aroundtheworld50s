import "server-only";
import { z } from "zod";
import { clientEnv } from "./client";

/**
 * Server-only environment variables. Importing this file from a Client
 * Component will fail at build time thanks to `import "server-only"`.
 *
 * If you see a parse error, this schema tells you exactly which variable is
 * missing or malformed in .env.local.
 */
const ServerEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, "Supabase service_role secret (never ship to the browser)"),
  DATABASE_URL: z
    .string()
    .url(
      "Postgres connection string used at runtime (transaction pooler on Vercel, direct locally)",
    ),
  DIRECT_URL: z
    .string()
    .url(
      "Postgres direct connection string used by Drizzle migrations (pooler does not support all DDL)",
    ),
  // Cloudinary credentials — required for admin image uploads (Phase 2).
  // Optional here so the dev server runs during Phases 0-1 without them.
  // The upload service validates at call time.
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
});

const parsed = ServerEnvSchema.safeParse({
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
});

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(`Invalid server environment variables. Set them in .env.local:\n${issues}`);
}

export const serverEnv = {
  ...clientEnv,
  ...parsed.data,
};
