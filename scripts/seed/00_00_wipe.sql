-- Chunk: wipe seeded tables before re-inserting.
DELETE FROM "gallery_images";
DELETE FROM "blog_blocks";
DELETE FROM "blog_itinerary_items";
DELETE FROM "blog_itineraries";
DELETE FROM "blog_posts";
DELETE FROM "tip_sections";
DELETE FROM "tips";
