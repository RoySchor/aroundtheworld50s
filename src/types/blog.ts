import type { BlogPost, BlogBlock, BlogItinerary, BlogItineraryItem } from "@/server/db/schema";

// Block data types — derived from Zod schemas (source of truth).
// Type-only re-exports are erased at compile time, so the "server-only"
// guard in the validators module does not affect client components.
export type {
  TextBlockData,
  TwoColumnBlockData,
  ImageGridBlockData,
  ImageCarouselBlockData,
  ItineraryWithMapBlockData,
  SocialEmbedBlockData,
} from "@/server/validators/blog";

// ---------------------------------------------------------------------------
// Full post with nested relations (return type of getPostBySlugAndIndex)
// ---------------------------------------------------------------------------

export type FullBlogPost = BlogPost & {
  blocks: BlogBlock[];
  itineraries: (BlogItinerary & { items: BlogItineraryItem[] })[];
};
