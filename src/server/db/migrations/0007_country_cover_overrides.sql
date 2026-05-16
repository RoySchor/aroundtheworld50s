CREATE TABLE "country_cover_overrides" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "country_slug" text NOT NULL,
  "cover_image" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "country_cover_overrides_country_slug_unique" UNIQUE("country_slug")
);
--> statement-breakpoint
CREATE TRIGGER country_cover_overrides_set_updated_at
BEFORE UPDATE ON country_cover_overrides
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
