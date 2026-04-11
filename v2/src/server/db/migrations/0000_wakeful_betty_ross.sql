CREATE TYPE "public"."blog_block_type" AS ENUM('text', 'two_column', 'image_grid', 'itinerary_with_map');--> statement-breakpoint
CREATE TYPE "public"."publish_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."tip_section_key" AS ENUM('essential_tips', 'budget_planning', 'food_dining', 'transportation', 'accommodation', 'safety_health');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin');--> statement-breakpoint
CREATE TABLE "blog_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"type" "blog_block_type" NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blog_blocks_post_position_unique" UNIQUE("post_id","position")
);
--> statement-breakpoint
CREATE TABLE "blog_itineraries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"title" text NOT NULL,
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
	CONSTRAINT "blog_itinerary_items_position_unique" UNIQUE("itinerary_id","position")
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
	"background_image" text,
	"tips_section" text,
	"tips_slug" text,
	"status" "publish_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"author_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_index_unique" UNIQUE("country_slug","post_index")
);
--> statement-breakpoint
CREATE TABLE "gallery_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cloudinary_public_id" text NOT NULL,
	"caption" text,
	"position" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "gallery_images_cloudinary_public_id_unique" UNIQUE("cloudinary_public_id")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"role" "user_role" DEFAULT 'admin' NOT NULL,
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
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tip_sections_tip_key_unique" UNIQUE("tip_id","section_key")
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
	CONSTRAINT "tips_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "blog_blocks" ADD CONSTRAINT "blog_blocks_post_id_blog_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_itineraries" ADD CONSTRAINT "blog_itineraries_post_id_blog_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_itinerary_items" ADD CONSTRAINT "blog_itinerary_items_itinerary_id_blog_itineraries_id_fk" FOREIGN KEY ("itinerary_id") REFERENCES "public"."blog_itineraries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_profiles_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tip_sections" ADD CONSTRAINT "tip_sections_tip_id_tips_id_fk" FOREIGN KEY ("tip_id") REFERENCES "public"."tips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "blog_blocks_post_idx" ON "blog_blocks" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "blog_itineraries_post_idx" ON "blog_itineraries" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "blog_itinerary_items_itinerary_idx" ON "blog_itinerary_items" USING btree ("itinerary_id");--> statement-breakpoint
CREATE INDEX "blog_posts_country_slug_idx" ON "blog_posts" USING btree ("country_slug");--> statement-breakpoint
CREATE INDEX "blog_posts_status_idx" ON "blog_posts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "gallery_images_position_idx" ON "gallery_images" USING btree ("position");--> statement-breakpoint
CREATE INDEX "tip_sections_tip_idx" ON "tip_sections" USING btree ("tip_id");--> statement-breakpoint
CREATE INDEX "tips_country_code_idx" ON "tips" USING btree ("country_code");