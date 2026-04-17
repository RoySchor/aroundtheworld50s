-- Migration 0002: Make blog_posts(country_slug, post_index) DEFERRABLE
--
-- post_index is now contiguous within each country_slug, renumbered on delete
-- to close gaps. The deferrable constraint allows the batch UPDATE
-- (decrement all higher indexes) to complete without mid-statement violations.
-- Uniqueness still holds at COMMIT.

ALTER TABLE "blog_posts"
  DROP CONSTRAINT "blog_posts_country_slug_post_index_unique";
--> statement-breakpoint
ALTER TABLE "blog_posts"
  ADD CONSTRAINT "blog_posts_country_slug_post_index_unique"
  UNIQUE ("country_slug", "post_index")
  DEFERRABLE INITIALLY DEFERRED;
