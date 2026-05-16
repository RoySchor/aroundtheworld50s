CREATE TYPE "public"."blog_block_type" AS ENUM('text', 'two_column', 'image_grid', 'itinerary_with_map');--> statement-breakpoint
CREATE TYPE "public"."publish_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."tip_section_key" AS ENUM('essential_tips', 'budget_planning', 'food_dining', 'transportation', 'accommodation', 'safety_health');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'reader');--> statement-breakpoint
CREATE TABLE "blog_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"type" "blog_block_type" NOT NULL,
	"data" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blog_blocks_post_position_unique" UNIQUE("post_id","position"),
	CONSTRAINT "blog_blocks_data_object_check" CHECK (jsonb_typeof("blog_blocks"."data") = 'object')
);
--> statement-breakpoint
CREATE TABLE "blog_itineraries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"title" text NOT NULL,
	"map_embed_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blog_itineraries_post_position_unique" UNIQUE("post_id","position")
);
--> statement-breakpoint
CREATE TABLE "blog_itinerary_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"itinerary_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blog_itinerary_items_itinerary_position_unique" UNIQUE("itinerary_id","position")
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"country_slug" text NOT NULL,
	"post_index" integer NOT NULL,
	"country" text NOT NULL,
	"country_code" text NOT NULL,
	"state" text,
	"title" text NOT NULL,
	"subtitle" text,
	"header" text,
	"description" text,
	"excerpt" text,
	"background_image" text,
	"tips_cta_copy" text,
	"tips_slug" text,
	"status" "publish_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"author_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_country_slug_post_index_unique" UNIQUE("country_slug","post_index"),
	CONSTRAINT "blog_posts_status_published_at_check" CHECK (("blog_posts"."status" = 'draft' AND "blog_posts"."published_at" IS NULL) OR ("blog_posts"."status" = 'published' AND "blog_posts"."published_at" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "gallery_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cloudinary_public_id" text NOT NULL,
	"caption" text,
	"position" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "gallery_images_cloudinary_public_id_unique" UNIQUE("cloudinary_public_id"),
	CONSTRAINT "gallery_images_position_unique" UNIQUE("position")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"role" "user_role" DEFAULT 'reader' NOT NULL,
	"display_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tip_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tip_id" uuid NOT NULL,
	"section_key" "tip_section_key" NOT NULL,
	"content" text,
	"enabled" boolean DEFAULT true NOT NULL,
	"position" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tip_sections_tip_id_section_key_unique" UNIQUE("tip_id","section_key"),
	CONSTRAINT "tip_sections_tip_id_position_unique" UNIQUE("tip_id","position")
);
--> statement-breakpoint
CREATE TABLE "tips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"country" text NOT NULL,
	"country_code" text NOT NULL,
	"state" text,
	"title" text NOT NULL,
	"description" text,
	"status" "publish_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tips_slug_unique" UNIQUE("slug"),
	CONSTRAINT "tips_status_published_at_check" CHECK (("tips"."status" = 'draft' AND "tips"."published_at" IS NULL) OR ("tips"."status" = 'published' AND "tips"."published_at" IS NOT NULL))
);
--> statement-breakpoint
ALTER TABLE "blog_blocks" ADD CONSTRAINT "blog_blocks_post_id_blog_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_itineraries" ADD CONSTRAINT "blog_itineraries_post_id_blog_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_itinerary_items" ADD CONSTRAINT "blog_itinerary_items_itinerary_id_blog_itineraries_id_fk" FOREIGN KEY ("itinerary_id") REFERENCES "public"."blog_itineraries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_profiles_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tip_sections" ADD CONSTRAINT "tip_sections_tip_id_tips_id_fk" FOREIGN KEY ("tip_id") REFERENCES "public"."tips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "tips_country_code_idx" ON "tips" USING btree ("country_code");--> statement-breakpoint
-- ---------------------------------------------------------------------------
-- Post-init SQL (hand-maintained).
--
-- Drizzle Kit generates the structural DDL above. Everything below is
-- written by hand because it's either not expressible in schema.ts
-- (triggers, functions, deferrable constraints) or deliberately kept out
-- of Drizzle's model (row-level security policies).
--
-- This section is part of migration 0000 on purpose: triggers, deferrable
-- uniques, and RLS are baseline requirements, not a follow-up. Drizzle
-- Kit will never regenerate this file once meta/0000_snapshot.json
-- exists, so these edits are safe.
-- ---------------------------------------------------------------------------

-- updated_at auto-bump. Runs for any UPDATE regardless of the client:
-- Drizzle, Supabase Studio, background jobs, psql — they all get consistent
-- timestamps. Cheaper and more reliable than bumping in app code.
--
-- The IS DISTINCT FROM guard makes this a content-change timestamp, not
-- an UPDATE-statement timestamp. Fetch-then-save flows that reissue the
-- same row values (common in edit forms that don't diff) leave updated_at
-- alone. Downstream readers — caches, sitemaps, audit logs — get the
-- semantic they actually want. IS DISTINCT FROM is null-safe so columns
-- toggling between NULL and non-NULL are still detected as changes.
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW IS DISTINCT FROM OLD THEN
    NEW.updated_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
CREATE TRIGGER profiles_set_updated_at
BEFORE UPDATE ON "profiles"
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint
CREATE TRIGGER blog_posts_set_updated_at
BEFORE UPDATE ON "blog_posts"
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint
CREATE TRIGGER blog_itineraries_set_updated_at
BEFORE UPDATE ON "blog_itineraries"
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint
CREATE TRIGGER blog_itinerary_items_set_updated_at
BEFORE UPDATE ON "blog_itinerary_items"
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint
CREATE TRIGGER blog_blocks_set_updated_at
BEFORE UPDATE ON "blog_blocks"
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint
CREATE TRIGGER tips_set_updated_at
BEFORE UPDATE ON "tips"
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint
CREATE TRIGGER tip_sections_set_updated_at
BEFORE UPDATE ON "tip_sections"
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint
CREATE TRIGGER gallery_images_set_updated_at
BEFORE UPDATE ON "gallery_images"
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint
-- Convert every (parent, position) unique to DEFERRABLE INITIALLY DEFERRED
-- so the admin can shift or swap positions inside one transaction without
-- the constraint firing mid-statement. The invariant still holds at COMMIT.
-- Drizzle's `unique()` builder can't express deferrable, so we DROP + ADD.
-- `blog_posts(country_slug, post_index)` is intentionally excluded —
-- post_index is a stable identifier, not a reorderable slot.
ALTER TABLE "blog_blocks" DROP CONSTRAINT "blog_blocks_post_position_unique";
--> statement-breakpoint
ALTER TABLE "blog_blocks" ADD CONSTRAINT "blog_blocks_post_position_unique" UNIQUE ("post_id", "position") DEFERRABLE INITIALLY DEFERRED;
--> statement-breakpoint
ALTER TABLE "blog_itineraries" DROP CONSTRAINT "blog_itineraries_post_position_unique";
--> statement-breakpoint
ALTER TABLE "blog_itineraries" ADD CONSTRAINT "blog_itineraries_post_position_unique" UNIQUE ("post_id", "position") DEFERRABLE INITIALLY DEFERRED;
--> statement-breakpoint
ALTER TABLE "blog_itinerary_items" DROP CONSTRAINT "blog_itinerary_items_itinerary_position_unique";
--> statement-breakpoint
ALTER TABLE "blog_itinerary_items" ADD CONSTRAINT "blog_itinerary_items_itinerary_position_unique" UNIQUE ("itinerary_id", "position") DEFERRABLE INITIALLY DEFERRED;
--> statement-breakpoint
ALTER TABLE "tip_sections" DROP CONSTRAINT "tip_sections_tip_id_position_unique";
--> statement-breakpoint
ALTER TABLE "tip_sections" ADD CONSTRAINT "tip_sections_tip_id_position_unique" UNIQUE ("tip_id", "position") DEFERRABLE INITIALLY DEFERRED;
--> statement-breakpoint
ALTER TABLE "gallery_images" DROP CONSTRAINT "gallery_images_position_unique";
--> statement-breakpoint
ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_position_unique" UNIQUE ("position") DEFERRABLE INITIALLY DEFERRED;
--> statement-breakpoint
-- Enable row-level security on every public table.
--
-- No policies are created yet: with RLS ON and no policies, non-superuser
-- roles (i.e. `anon` and `authenticated` accessing via PostgREST with the
-- publishable key) are denied by default. This closes the exposure of the
-- Supabase auto-generated REST API without breaking our app, which
-- connects via DATABASE_URL as the `postgres` role (which has BYPASSRLS).
--
-- Policies (public SELECT for published rows, admin ALL via profiles.role)
-- will be added in a follow-up migration once the admin auth flow lands.
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "blog_posts" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "blog_itineraries" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "blog_itinerary_items" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "blog_blocks" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "tips" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "tip_sections" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "gallery_images" ENABLE ROW LEVEL SECURITY;