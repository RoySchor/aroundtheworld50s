/**
 * Drizzle schema — single source of truth for the v2 database shape.
 *
 * Migrations are generated from this file via `npm run db:generate` and
 * applied via `npm run db:migrate`. Do NOT hand-edit files in
 * `./migrations/` — the generator owns them.
 *
 * Design notes that aren't obvious from the column list:
 *
 * - Every mutable row uses a surrogate `uuid` primary key so foreign keys
 *   never have to change when the user-facing identity (slug, index, etc.)
 *   changes. Lookup keys like `(country_slug, post_index)` are enforced as
 *   separate unique constraints.
 *
 * - `timestamptz` everywhere. Bare `timestamp` loses the zone and creates
 *   subtle bugs across locales.
 *
 * - Enums are declared with `pgEnum` so Drizzle types them as literal
 *   unions on both insert and select. Adding a value later is a one-line
 *   migration (`ALTER TYPE ... ADD VALUE`).
 *
 * - Block-shape-specific fields live in a `jsonb` column on `blog_blocks`,
 *   validated at the API boundary with a zod discriminated union. Breaking
 *   them into separate per-type tables would force joins for no query we
 *   actually run.
 *
 * - `instagram` is intentionally NOT in `blogBlockType` — the v1 embed is
 *   broken and porting it is a fast-follow. Adding it later is a one-line
 *   enum migration, not a redesign.
 */

import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const userRole = pgEnum("user_role", ["admin"]);

/**
 * Posts and tips share the same publish lifecycle. Draft rows are visible
 * only to authenticated admins; published rows are public.
 */
export const publishStatus = pgEnum("publish_status", ["draft", "published"]);

/**
 * Block kinds supported by the blog renderer. Keep in sync with the zod
 * discriminated union that validates `blog_blocks.data` at the API boundary.
 *
 * NOTE: `instagram` is deliberately omitted — the v1 embed is broken. When
 * it's fixed, add it here and ship a migration that extends the enum.
 */
export const blogBlockType = pgEnum("blog_block_type", [
  "text",
  "two_column",
  "image_grid",
  "itinerary_with_map",
]);

/**
 * Fixed section keys used by the tips editor (ported from v1). Reordering
 * is handled by `tip_sections.position`, not by the enum order.
 */
export const tipSectionKey = pgEnum("tip_section_key", [
  "essential_tips",
  "budget_planning",
  "food_dining",
  "transportation",
  "accommodation",
  "safety_health",
]);

// ---------------------------------------------------------------------------
// profiles
// ---------------------------------------------------------------------------

/**
 * App-level user record. The `id` matches `auth.users.id` in the Supabase
 * auth schema — we don't create the FK at the Drizzle level because that
 * schema is managed by Supabase, not by us. Insert a row here via a
 * trigger or server action when a new admin is created.
 */
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  role: userRole("role").notNull().default("admin"),
  displayName: text("display_name"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------------------------------------------------------------------------
// blog_posts
// ---------------------------------------------------------------------------

/**
 * One row per blog post. URL shape: `/blog/{countrySlug}/{postIndex}`.
 *
 * `(countrySlug, postIndex)` is unique but NOT the primary key — the
 * surrogate uuid is. That means deleting post #1 and keeping #2 is safe:
 * indexes are stable integers within a country, no renumbering, no
 * dangling FKs in `blog_blocks` / `blog_itineraries`.
 *
 * `tipsSlug` is a soft reference (plain text, not a FK) because a post can
 * be authored before its tips page exists. The app resolves it at read time.
 */
export const blogPosts = pgTable(
  "blog_posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Lookup key — `/blog/{countrySlug}/{postIndex}`.
    countrySlug: text("country_slug").notNull(),
    postIndex: integer("post_index").notNull(),

    // Display / filter fields copied from v1.
    country: text("country").notNull(),
    countryCode: text("country_code").notNull(),
    state: text("state"),

    title: text("title").notNull(),
    subtitle: text("subtitle"),
    header: text("header"),
    description: text("description"), // HTML allowed

    backgroundImage: text("background_image"), // Cloudinary public_id
    tipsSection: text("tips_section"), // the CTA copy ("💥 Insider Tips...")
    tipsSlug: text("tips_slug"), // soft ref to tips.slug

    // Draft lifecycle — see publishStatus comment.
    status: publishStatus("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),

    // Audit columns. `createdAt` is backfilled from v1's committed dates so
    // historical ordering stays accurate after the port.
    authorId: uuid("author_id").references(() => profiles.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    unique("blog_posts_slug_index_unique").on(t.countrySlug, t.postIndex),
    index("blog_posts_country_slug_idx").on(t.countrySlug),
    index("blog_posts_status_idx").on(t.status),
  ],
);

// ---------------------------------------------------------------------------
// blog_itineraries + blog_itinerary_items
// ---------------------------------------------------------------------------

/**
 * Itineraries are their own rows (not JSONB) so the `itinerary_with_map`
 * block can reference them by UUID instead of by ordinal index. In v1 the
 * block carries a `mapIndex: number` which silently breaks when the author
 * reorders itineraries; a real FK makes reorder a plain UPDATE.
 */
export const blogItineraries = pgTable(
  "blog_itineraries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => blogPosts.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    title: text("title").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    unique("blog_itineraries_post_position_unique").on(t.postId, t.position),
    index("blog_itineraries_post_idx").on(t.postId),
  ],
);

export const blogItineraryItems = pgTable(
  "blog_itinerary_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    itineraryId: uuid("itinerary_id")
      .notNull()
      .references(() => blogItineraries.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    content: text("content").notNull(),
  },
  (t) => [
    unique("blog_itinerary_items_position_unique").on(
      t.itineraryId,
      t.position,
    ),
    index("blog_itinerary_items_itinerary_idx").on(t.itineraryId),
  ],
);

// ---------------------------------------------------------------------------
// blog_blocks
// ---------------------------------------------------------------------------

/**
 * Ordered content blocks for a post. `data` carries the shape-specific
 * payload — the app parses it with a zod discriminated union keyed on
 * `type`. Example shapes:
 *
 *   text:               { html: string }
 *   two_column:         { leftType, rightType, leftImage?, rightImage?,
 *                         imageAlt?, html: string }
 *   image_grid:         { images: string[] }
 *   itinerary_with_map: { itineraryId: string }  // UUID, not ordinal
 */
export const blogBlocks = pgTable(
  "blog_blocks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => blogPosts.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    type: blogBlockType("type").notNull(),
    data: jsonb("data").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    unique("blog_blocks_post_position_unique").on(t.postId, t.position),
    index("blog_blocks_post_idx").on(t.postId),
  ],
);

// ---------------------------------------------------------------------------
// tips + tip_sections
// ---------------------------------------------------------------------------

/**
 * One row per country/state tips page. URL: `/tips/{slug}`.
 * Shares the same draft/publish lifecycle as blog posts — consistency is
 * worth more than cleverness here.
 */
export const tips = pgTable(
  "tips",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    country: text("country").notNull(),
    countryCode: text("country_code").notNull(),
    state: text("state"),
    title: text("title").notNull(),
    description: text("description"),

    status: publishStatus("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("tips_country_code_idx").on(t.countryCode)],
);

/**
 * Tips are broken into named sections (ported from v1's JSON shape). Each
 * section is its own row so the admin can reorder and so adding a new
 * section is a one-line enum migration, not a column add.
 */
export const tipSections = pgTable(
  "tip_sections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tipId: uuid("tip_id")
      .notNull()
      .references(() => tips.id, { onDelete: "cascade" }),
    sectionKey: tipSectionKey("section_key").notNull(),
    content: text("content"), // HTML allowed
    enabled: boolean("enabled").notNull().default(true),
    position: integer("position").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    unique("tip_sections_tip_key_unique").on(t.tipId, t.sectionKey),
    index("tip_sections_tip_idx").on(t.tipId),
  ],
);

// ---------------------------------------------------------------------------
// gallery_images
// ---------------------------------------------------------------------------

/**
 * Homepage gallery. In v1 this was pulled from Cloudinary by tag, which
 * meant the order came from whatever Cloudinary returned. Moving it into
 * Postgres gives the admin explicit ordering and per-image metadata
 * (caption, etc.) without needing to re-tag assets.
 */
export const galleryImages = pgTable(
  "gallery_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cloudinaryPublicId: text("cloudinary_public_id").notNull().unique(),
    caption: text("caption"),
    position: integer("position").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("gallery_images_position_idx").on(t.position)],
);

// ---------------------------------------------------------------------------
// Inferred types — import these in repositories/services instead of
// re-declaring row shapes.
// ---------------------------------------------------------------------------

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;

export type BlogItinerary = typeof blogItineraries.$inferSelect;
export type NewBlogItinerary = typeof blogItineraries.$inferInsert;

export type BlogItineraryItem = typeof blogItineraryItems.$inferSelect;
export type NewBlogItineraryItem = typeof blogItineraryItems.$inferInsert;

export type BlogBlock = typeof blogBlocks.$inferSelect;
export type NewBlogBlock = typeof blogBlocks.$inferInsert;

export type Tip = typeof tips.$inferSelect;
export type NewTip = typeof tips.$inferInsert;

export type TipSection = typeof tipSections.$inferSelect;
export type NewTipSection = typeof tipSections.$inferInsert;

export type GalleryImage = typeof galleryImages.$inferSelect;
export type NewGalleryImage = typeof galleryImages.$inferInsert;
