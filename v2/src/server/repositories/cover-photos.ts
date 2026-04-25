import "server-only";
import { eq, sql } from "drizzle-orm";
import { db } from "@/server/db";
import { countryCoverOverrides } from "@/server/db/schema";

/** Single override row for a country slug, or undefined. */
export async function getCoverOverride(countrySlug: string) {
  return db.query.countryCoverOverrides.findFirst({
    where: eq(countryCoverOverrides.countrySlug, countrySlug),
  });
}

export type CountryWithCover = {
  countrySlug: string;
  country: string;
  countryCode: string;
  state: string | null;
  defaultCover: string | null;
  overrideCover: string | null;
};

/**
 * All countries/states that have at least one published blog, with their
 * default cover (latest post's backgroundImage) and any explicit override.
 * Serves both the admin Cover Photos page and the destinations page.
 */
export async function getAllCountriesWithCovers(): Promise<CountryWithCover[]> {
  const rows = await db.execute(sql`
    SELECT
      p.country_slug   AS "countrySlug",
      p.country         AS "country",
      p.country_code    AS "countryCode",
      p.state           AS "state",
      p.background_image AS "defaultCover",
      o.cover_image     AS "overrideCover"
    FROM (
      SELECT DISTINCT ON (country_slug)
        country_slug, country, country_code, state, background_image
      FROM blog_posts
      WHERE status = 'published'
      ORDER BY country_slug, published_at DESC NULLS LAST, created_at DESC
    ) p
    LEFT JOIN country_cover_overrides o ON o.country_slug = p.country_slug
    ORDER BY p.country, p.state NULLS FIRST
  `);
  return rows as unknown as CountryWithCover[];
}
