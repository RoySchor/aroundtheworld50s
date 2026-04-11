import { loadEnvConfig } from "@next/env";
import type { Config } from "drizzle-kit";

// Load .env.local + .env the same way Next.js does so Drizzle sees the same
// environment Next sees at runtime. Drizzle Kit's bundled dotenv only reads
// plain `.env` — without this, `.env.local` is silently ignored.
loadEnvConfig(process.cwd());

const directUrl = process.env.DIRECT_URL;
if (!directUrl) {
  throw new Error(
    "DIRECT_URL is not set. Drizzle migrations require a direct Postgres connection (not the transaction pooler). Set DIRECT_URL in .env.local.",
  );
}

export default {
  schema: "./src/server/db/schema.ts",
  out: "./src/server/db/migrations",
  dialect: "postgresql",
  dbCredentials: { url: directUrl },
  strict: true,
  verbose: true,
} satisfies Config;
