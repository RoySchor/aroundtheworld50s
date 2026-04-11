import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { serverEnv } from "@/lib/env/server";

/**
 * Postgres client stashed on `globalThis` in development so Next.js HMR
 * reuses the same connection across hot reloads. Without this, every code
 * edit leaks a fresh connection to the Supabase pooler and the connection
 * pool is eventually exhausted.
 *
 * In production (Vercel), each serverless invocation gets a fresh process,
 * so the global is effectively a no-op. `max: 1` keeps us at one connection
 * per invocation — the correct setting for serverless Postgres.
 */
const globalForDb = globalThis as unknown as {
  pgClient?: ReturnType<typeof postgres>;
};

const client =
  globalForDb.pgClient ??
  postgres(serverEnv.DATABASE_URL, {
    prepare: false, // required by Supabase's transaction pooler
    max: 1, // one connection per serverless invocation
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pgClient = client;
}

export const db = drizzle(client);
